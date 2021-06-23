import dotenv from "dotenv";
dotenv.config({ path: ".env" });

export const PORT = process.env.PORT || 3000;
export const WECHAT_WORK_CORPID = process.env.WECHAT_WORK_CORPID;
export const WECHAT_WORK_CORPSECRET = process.env.WECHAT_WORK_CORPSECRET;
