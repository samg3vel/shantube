import express from "express";
import { signin, signup, googleAuth } from "../controllers/auth.js";

const router = express.Router();

// Sign UP
router.post("/signup", signup);
// Sign In
router.post("/signin", signin);
// Sign In Google
router.post("/google", googleAuth);

export default router;