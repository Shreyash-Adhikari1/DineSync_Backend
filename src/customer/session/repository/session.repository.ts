import { ISession, ISessionMember, SessionModel } from "../model/session.model";

export interface SessionRepositoryInterface {
  createSession(session: Partial<ISession>): Promise<ISession>;

  findSessionById(sessionId: string): Promise<ISession | null>;

  findActiveSessionByTable(tableId: string): Promise<ISession | null>;

  getSessionsByRestaurant(restaurantId: string): Promise<ISession[]>;

  addMember(
    sessionId: string,
    member: ISessionMember,
  ): Promise<ISession | null>;

  closeSession(sessionId: string): Promise<ISession | null>;

  markDrinksNudgeShown(sessionId: string): Promise<ISession | null>;

  deleteSession(sessionId: string): Promise<ISession | null>;
}

export interface SessionRepositoryInterface {
  createSession(session: Partial<ISession>): Promise<ISession>;

  findSessionById(sessionId: string): Promise<ISession | null>;

  findActiveSessionByTable(tableId: string): Promise<ISession | null>;

  getSessionsByRestaurant(restaurantId: string): Promise<ISession[]>;

  addMember(
    sessionId: string,
    member: ISessionMember,
  ): Promise<ISession | null>;

  closeSession(sessionId: string): Promise<ISession | null>;

  deleteSession(sessionId: string): Promise<ISession | null>;
}

export class SessionRepository implements SessionRepositoryInterface {
  createSession(session: Partial<ISession>): Promise<ISession> {
    const newSession = new SessionModel(session);

    return newSession.save();
  }

  findSessionById(sessionId: string): Promise<ISession | null> {
    return SessionModel.findById(sessionId).exec();
  }

  findActiveSessionByTable(tableId: string): Promise<ISession | null> {
    return SessionModel.findOne({
      tableId,
      status: "active",
    }).exec();
  }

  getSessionsByRestaurant(restaurantId: string): Promise<ISession[]> {
    return SessionModel.find({
      restaurantId,
    })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  addMember(
    sessionId: string,
    member: ISessionMember,
  ): Promise<ISession | null> {
    return SessionModel.findByIdAndUpdate(
      sessionId,
      {
        $push: {
          members: member,
        },
      },
      {
        returnDocument: "after",
      },
    ).exec();
  }

  closeSession(sessionId: string): Promise<ISession | null> {
    return SessionModel.findByIdAndUpdate(
      sessionId,
      {
        $set: {
          status: "closed",
          endedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
      },
    ).exec();
  }

  deleteSession(sessionId: string): Promise<ISession | null> {
    return SessionModel.findByIdAndDelete(sessionId).exec();
  }

  async markDrinksNudgeShown(sessionId: string) {
    return SessionModel.findByIdAndUpdate(
      sessionId,
      {
        drinksNudgeShown: true,
      },
      {
        new: true,
      },
    );
  }
}
