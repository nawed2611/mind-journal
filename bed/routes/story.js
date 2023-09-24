import express from "express";
import storyController from "../controllers/storyController.js";

const router = express.Router();

router.get("/:id", storyController.findOne);

export default router;
