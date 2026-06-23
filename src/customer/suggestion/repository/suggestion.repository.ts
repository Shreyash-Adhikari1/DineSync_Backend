import {
  ISuggestion,
  ISuggestionVote,
  SuggestionModel,
} from "../model/suggestion.model";

export interface ISuggestionRepository {
  createSuggestion(data: Partial<ISuggestion>): Promise<ISuggestion>;

  findSuggestionById(suggestionId: string): Promise<ISuggestion | null>;

  getActiveSuggestionBySession(sessionId: string): Promise<ISuggestion | null>;

  getSuggestionsBySession(sessionId: string): Promise<ISuggestion[]>;

  addVote(
    suggestionId: string,
    vote: ISuggestionVote,
  ): Promise<ISuggestion | null>;

  updateSuggestionStatus(
    suggestionId: string,
    status: "pending" | "approved" | "rejected" | "expired",
  ): Promise<ISuggestion | null>;

  expireSuggestions(): Promise<void>;

  deleteSuggestion(suggestionId: string): Promise<ISuggestion | null>;
}

export class SuggestionRepository {
  async createSuggestion(data: Partial<ISuggestion>): Promise<ISuggestion> {
    return SuggestionModel.create(data);
  }

  async findSuggestionById(suggestionId: string): Promise<ISuggestion | null> {
    return SuggestionModel.findById(suggestionId);
  }

  async getActiveSuggestionBySession(
    sessionId: string,
  ): Promise<ISuggestion | null> {
    return SuggestionModel.findOne({
      sessionId,
      status: "pending",
    });
  }

  async getSuggestionsBySession(sessionId: string): Promise<ISuggestion[]> {
    return SuggestionModel.find({
      sessionId,
    }).sort({
      createdAt: -1,
    });
  }

  async addVote(
    suggestionId: string,
    vote: ISuggestionVote,
  ): Promise<ISuggestion | null> {
    return SuggestionModel.findOneAndUpdate(
      {
        _id: suggestionId,
        "votes.memberId": {
          $ne: vote.memberId,
        },
      },
      {
        $push: {
          votes: vote,
        },
      },
      {
        returnDocument: "after",
      },
    );
  }

  async updateSuggestionStatus(
    suggestionId: string,
    status: "pending" | "approved" | "rejected" | "expired",
  ): Promise<ISuggestion | null> {
    return SuggestionModel.findByIdAndUpdate(
      suggestionId,
      {
        status,
      },
      {
        returnDocument: "after",
      },
    );
  }

  async expireSuggestions(): Promise<void> {
    await SuggestionModel.updateMany(
      {
        status: "pending",
        expiresAt: {
          $lt: new Date(),
        },
      },
      {
        status: "expired",
      },
    );
  }

  async deleteSuggestion(suggestionId: string): Promise<ISuggestion | null> {
    return SuggestionModel.findByIdAndDelete(suggestionId);
  }

  async getVoteCount(suggestionId: string): Promise<number> {
    const suggestion = await SuggestionModel.findById(suggestionId);

    return suggestion ? suggestion.votes.length : 0;
  }
}
