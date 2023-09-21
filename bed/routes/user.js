import express from "express";
import { findMultiple, create } from "../controllers/userController.js";

const router = express.Router();

router.get("/", (req, res) => {
  findMultiple(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/", (req, res) => {
  create(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

export default router;
