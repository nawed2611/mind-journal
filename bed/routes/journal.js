import express from "express";
import journalController from "../controllers/journalController.js";

const router = express.Router();

router.get("/", journalController.findMultiple);
router.get("/:id", journalController.findOne);
router.post("/", journalController.create);
router.put("/:id", journalController.update);
router.delete("/:id", journalController.deleteOne);

export default router;
