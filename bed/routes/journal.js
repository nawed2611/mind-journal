import express from "express";
import journalController from "../controllers/journalController.js";

const router = express.Router();

router.get("/", journalController.findMultiple);
router.get("/:id", journalController.findOne);
router.post("/", journalController.createOne);
router.put("/:id", journalController.updateOne);
router.delete("/:id", journalController.deleteOne);

export default router;
