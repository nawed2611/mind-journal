import express from "express";
import { signUp, login, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", (req, res) => {
  login(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/signUp", (req, res) => {
  signUp(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.post("/logout", (req, res) => {
  logout(req, res)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});


export default router;


