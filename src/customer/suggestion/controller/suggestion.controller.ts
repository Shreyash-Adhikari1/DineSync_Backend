import { Request, Response } from "express";

import { SuggestionService } from "../service/suggestion.service";
import { CreateSuggestionDTO, VoteSuggestionDTO } from "../dto/suggestion.dto";

const suggestionService = new SuggestionService();

export class SuggestionController {
  createSuggestion = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;

      const parsed = CreateSuggestionDTO.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid suggestion payload",
        });
      }

      const suggestion = await suggestionService.createSuggestion(
        sessionId as string,
        parsed.data.memberId,
        parsed.data.menuItemId,
      );

      return res.status(201).json({
        success: true,
        message: "Suggestion created",
        suggestion,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  voteSuggestion = async (req: Request, res: Response) => {
    try {
      const { suggestionId } = req.params;

      const parsed = VoteSuggestionDTO.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid vote payload",
        });
      }

      const suggestion = await suggestionService.voteSuggestion(
        suggestionId as string,
        parsed.data.memberId,
        parsed.data.vote,
      );

      return res.status(200).json({
        success: true,
        message: "Vote recorded",
        suggestion,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  getSuggestionsBySession = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;

      const suggestions = await suggestionService.getSuggestionsBySession(
        sessionId.toString(),
      );

      return res.status(200).json({
        success: true,
        suggestions,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  expireSuggestion = async (req: Request, res: Response) => {
    try {
      const { suggestionId } = req.params;

      const suggestion = await suggestionService.expireSuggestion(
        suggestionId as string,
      );

      return res.status(200).json({
        success: true,
        message: "Suggestion expired",
        suggestion,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
}
