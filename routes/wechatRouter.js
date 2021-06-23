import { Router } from "express";
import { sendMessage } from "../controllers/wechatController.js";

const router = Router();

router.post("/sendMessage", sendMessage);

export default router;
