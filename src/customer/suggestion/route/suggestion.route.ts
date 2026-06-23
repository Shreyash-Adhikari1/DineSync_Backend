import express from "express";

import { SuggestionController } from "../controller/suggestion.controller";

const suggestionRouter = express.Router();

const suggestionController = new SuggestionController();

suggestionRouter.post("/:sessionId", suggestionController.createSuggestion);

suggestionRouter.post(
  "/vote/:suggestionId",
  suggestionController.voteSuggestion,
);

suggestionRouter.get(
  "/session/:sessionId",
  suggestionController.getSuggestionsBySession,
);

suggestionRouter.patch(
  "/expire/:suggestionId",
  suggestionController.expireSuggestion,
);

export default suggestionRouter;
