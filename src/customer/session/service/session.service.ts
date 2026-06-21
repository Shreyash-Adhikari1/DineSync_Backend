import { nanoid } from "nanoid";
import { RestaurantRepository } from "../../../business/restaurant/repository/restaurant.repository";
import { TableRepository } from "../../../business/table/repo/table.repository";
import { HttpError } from "../../../errors/http-error";
import { ISession } from "../model/session.model";
import { SessionRepository } from "../repository/session.repository";
import { getIO } from "../../../socket/socket";

const sessionRepo = new SessionRepository();
const tableRepo = new TableRepository();
const restaurantRepo = new RestaurantRepository();

export class SessionService {
  private async withRestaurantName(session: ISession) {
    const restaurant = await restaurantRepo.findRestaurantById(
      session.restaurantId.toString(),
    );
    const sessionObject =
      typeof session.toObject === "function" ? session.toObject() : session;

    return {
      ...sessionObject,
      restaurantName: restaurant?.restaurantName || "DineSync",
    };
  }

  async joinTable(
    qrToken: string,
    memberName: string,
  ): Promise<{ session: any; memberId: string }> {
    const table = await tableRepo.findTableByQrToken(qrToken);

    if (!table) {
      throw new HttpError(404, "Table Not Found");
    }

    let session = await sessionRepo.findActiveSessionByTable(
      table._id.toString(),
    );

    if (!session) {
      session = await sessionRepo.createSession({
        restaurantId: table.restaurantId,
        tableId: table._id,
        tableNumber: table.tableNumber,
        members: [],
      });
    }
    const memberId = `MEM_${nanoid(8)}`;
    const updatedSession = await sessionRepo.addMember(session._id.toString(), {
      memberId,
      name: memberName,
      joinedAt: new Date(),
    });

    if (!updatedSession) {
      throw new HttpError(400, "Failed To Join Session");
    }

    const io = getIO();

    io.to(updatedSession._id.toString()).emit("member-joined", {
      memberId,
      name: memberName,
      joinedAt: new Date(),
    });

    return { session: await this.withRestaurantName(updatedSession), memberId };
  }

  async getSession(sessionId: string): Promise<any> {
    const session = await sessionRepo.findSessionById(sessionId);

    if (!session) {
      throw new HttpError(404, "Session Not Found");
    }

    return this.withRestaurantName(session);
  }

  async getActiveSessionByTable(tableId: string): Promise<ISession | null> {
    return sessionRepo.findActiveSessionByTable(tableId);
  }

  async closeSession(ownerId: string, sessionId: string): Promise<ISession> {
    const session = await sessionRepo.findSessionById(sessionId);

    if (!session) {
      throw new HttpError(404, "Session Not Found");
    }

    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      session.restaurantId.toString(),
    );

    if (!restaurant) {
      throw new HttpError(403, "Unauthorized");
    }

    if (session.status === "closed") {
      return session;
    }

    const closedSession = await sessionRepo.closeSession(sessionId);

    if (!closedSession) {
      throw new HttpError(400, "Failed To Close Session");
    }

    const io = getIO();

    io.to(sessionId).emit("session-closed", {
      sessionId,
    });

    return closedSession;
  }

  async getRestaurantSessions(
    ownerId: string,
    restaurantId: string,
  ): Promise<ISession[]> {
    const restaurant = await restaurantRepo.findRestaurantByOwnerAndId(
      ownerId,
      restaurantId,
    );

    if (!restaurant) {
      throw new HttpError(404, "Restaurant Not Found");
    }

    return sessionRepo.getSessionsByRestaurant(restaurantId);
  }
}
