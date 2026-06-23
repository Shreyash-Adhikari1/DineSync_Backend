import { HttpError } from "../../../errors/http-error";

import { SuggestionRepository } from "../repository/suggestion.repository";

import { SessionRepository } from "../../session/repository/session.repository";

import { MenuRepository } from "../../../business/menu/repository/menu.repository";

import { getIO } from "../../../socket/socket";
import { OrderRepository } from "../../order/repository/order.repository";

const suggestionRepo = new SuggestionRepository();

const sessionRepo = new SessionRepository();

const menuRepo = new MenuRepository();

const orderRepo = new OrderRepository();

export class SuggestionService {
  async createSuggestion(
    sessionId: string,
    memberId: string,
    menuItemId: string,
  ) {
    const session = await sessionRepo.findSessionById(sessionId);

    if (!session) {
      throw new HttpError(404, "Session not found");
    }
    const orders = await orderRepo.getOrdersBySession(sessionId);
    if (orders.length === 0) {
      throw new HttpError(
        400,
        "At least one order must exist before creating suggestions",
      );
    }
    if (session.members.length <= 1) {
      throw new HttpError(
        400,
        "At least 2 members are required to create suggestions",
      );
    }

    const memberExists = session.members.some(
      (member) => member.memberId === memberId,
    );

    if (!memberExists) {
      throw new HttpError(403, "Member not part of session");
    }

    const existing =
      await suggestionRepo.getActiveSuggestionBySession(sessionId);

    if (existing) {
      throw new HttpError(400, "Another suggestion is already active");
    }

    const menuItem = await menuRepo.getMenuItemById(menuItemId);

    if (!menuItem) {
      throw new HttpError(404, "Menu item not found");
    }

    const requiredVotes = Math.ceil(session.members.length * 0.75);

    const suggestion = await suggestionRepo.createSuggestion({
      sessionId: session._id,
      tableId: session.tableId,

      suggesterId: memberId,

      menuItemId: menuItem._id,

      menuItemName: menuItem.name,
      menuItemPrice: menuItem.price,

      requiredVotes,

      votes: [
        {
          memberId,
          vote: true,
        },
      ],
    });

    const io = getIO();

    io.to(sessionId).emit("suggestion-created", suggestion);

    return suggestion;
  }
  async voteSuggestion(suggestionId: string, memberId: string, vote: boolean) {
    const suggestion = await suggestionRepo.findSuggestionById(suggestionId);

    if (!suggestion) {
      throw new HttpError(404, "Suggestion not found");
    }

    if (suggestion.status !== "pending") {
      throw new HttpError(400, `Suggestion already ${suggestion.status}`);
    }

    if (new Date() > suggestion.expiresAt) {
      await suggestionRepo.updateSuggestionStatus(suggestionId, "expired");

      throw new HttpError(400, "Suggestion expired");
    }

    const session = await sessionRepo.findSessionById(
      suggestion.sessionId.toString(),
    );

    if (!session) {
      throw new HttpError(404, "Session not found");
    }

    const memberExists = session.members.some(
      (member) => member.memberId === memberId,
    );

    if (!memberExists) {
      throw new HttpError(403, "Member not part of session");
    }

    const updated = await suggestionRepo.addVote(suggestionId, {
      memberId,
      vote,
    });

    if (!updated) {
      throw new HttpError(400, "Already voted");
    }

    const io = getIO();

    io.to(suggestion.sessionId.toString()).emit("suggestion-updated", updated);

    const yesVotes = updated.votes.filter((v) => v.vote).length;

    /*
     * APPROVED
     */

    if (yesVotes >= updated.requiredVotes) {
      const approvedSuggestion = await suggestionRepo.updateSuggestionStatus(
        suggestionId,
        "approved",
      );

      if (!approvedSuggestion) {
        throw new HttpError(500, "Failed to approve suggestion");
      }

      // Add item to every member's order
      const orders = await orderRepo.getOrdersBySession(session._id.toString());

      for (const order of orders) {
        await orderRepo.addSharedItem(order._id.toString(), {
          menuItemId: approvedSuggestion.menuItemId,
          name: approvedSuggestion.menuItemName,
          unitPrice: approvedSuggestion.menuItemPrice,
          quantity: 1,
          subtotal: approvedSuggestion.menuItemPrice,
          allergens: [],
          specialInstructions: "",
        });
      }

      const io = getIO();

      io.to(session._id.toString()).emit(
        "suggestion-approved",
        approvedSuggestion,
      );

      return approvedSuggestion;
    }
    /*
     * REJECTED
     */

    const remainingMembers = session.members.length - updated.votes.length;

    const maxPossibleYes = yesVotes + remainingMembers;

    if (maxPossibleYes < updated.requiredVotes) {
      const rejectedSuggestion = await suggestionRepo.updateSuggestionStatus(
        suggestionId,
        "rejected",
      );

      if (!rejectedSuggestion) {
        throw new HttpError(500, "Failed to reject suggestion");
      }

      io.to(session._id.toString()).emit(
        "suggestion-rejected",
        rejectedSuggestion,
      );

      return rejectedSuggestion;
    }

    return updated;
  }

  async expireSuggestion(suggestionId: string) {
    const suggestion = await suggestionRepo.updateSuggestionStatus(
      suggestionId,
      "expired",
    );

    if (!suggestion) {
      throw new HttpError(404, "Suggestion not found");
    }

    const io = getIO();

    io.to(suggestion.sessionId.toString()).emit(
      "suggestion-expired",
      suggestion,
    );

    return suggestion;
  }
  async getSuggestionsBySession(sessionId: string) {
    return suggestionRepo.getSuggestionsBySession(sessionId);
  }
}
