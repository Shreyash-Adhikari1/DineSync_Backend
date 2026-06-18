import { Request, Response } from "express";
import { JoinSessionDTO } from "../dto/session.dto";
import { SessionService } from "../service/session.service";

const sessionService = new SessionService();

export class SessionController {
  joinTable = async (req: Request, res: Response) => {
    try {
      const { qrToken } = req.params;

      const parsed = JoinSessionDTO.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid Name",
        });
      }

      const result = await sessionService.joinTable(
        qrToken as string,
        parsed.data.name,
      );

      return res.status(200).json({
        success: true,
        message: "Joined Session Successfully",
        session: result.session,
        memberId: result.memberId,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  getSession = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;

      const session = await sessionService.getSession(sessionId as string);

      return res.status(200).json({
        success: true,
        session,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  closeSession = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      const { sessionId } = req.params;

      const session = await sessionService.closeSession(
        ownerId,
        sessionId as string,
      );

      return res.status(200).json({
        success: true,
        message: "Session Closed Successfully",
        session,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  getRestaurantSessions = async (req: Request, res: Response) => {
    try {
      const ownerId = (req as any).business.id;

      const { restaurantId } = req.params;

      const sessions = await sessionService.getRestaurantSessions(
        ownerId,
        restaurantId as string,
      );

      return res.status(200).json({
        success: true,
        sessions,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  getActiveSessionByTable = async (req: Request, res: Response) => {
    try {
      const { tableId } = req.params;

      const session = await sessionService.getActiveSessionByTable(
        tableId as string,
      );

      return res.status(200).json({
        success: true,
        session,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
}
