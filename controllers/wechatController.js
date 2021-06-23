import { sendMessageToWeChatWork } from "../helper/wechatHelper.js";

async function sendMessage(req, res) {
  try {
    const msgData = req.body;
    const rtn = await sendMessageToWeChatWork(msgData.users, msgData.message);
    res.header("Content-Type", "application/json");
    return res.send(JSON.stringify(rtn, null, 2));
  } catch (error) {
    console.error("sendMessageController error", error);
  }
}

export { sendMessage };
