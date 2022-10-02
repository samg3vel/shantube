import express from "express";
import {
    updateUser, deleteUser,
    getUser, subscribe, unsubscribe, like, dislike
} from "../controllers/user.js";
import { verifyToken } from "../verifyToken.js";

const router = express.Router();

router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.get("/find/:id", getUser);
router.put("/sub/:id", verifyToken, subscribe);
router.put("/unsub/:id", verifyToken, unsubscribe);
router.put("/like/:videoid", verifyToken, like);
router.put("/dislike/:videoid", verifyToken, dislike);

export default router;