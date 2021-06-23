import fetch from "node-fetch";
import fs from "fs/promises";

const PATH_ACCESS_TOKEN_JSON = "./accessToken.json";

async function readAccessTokenJson() {
  try {
    const accessToken = await fs.readFile(PATH_ACCESS_TOKEN_JSON);
    return JSON.parse(accessToken.toString());
  } catch (error) {
    console.error("Failed to read file", error);
  }
}

async function writeAccessTokenJson(jsonData) {
  try {
    await fs.writeFile(PATH_ACCESS_TOKEN_JSON, JSON.stringify(jsonData));
  } catch (error) {
    console.error("Failed to read file", error);
  }
}

async function clearAccessTokenJson() {
  try {
    const accessToken = readAccessTokenJson();
    accessToken.access_token = "";

    await fs.writeFile(PATH_ACCESS_TOKEN_JSON, JSON.stringify(accessToken));
  } catch (error) {
    console.error("Failed to read file", error);
  }
}

async function getToken(tokenClear) {
  if (tokenClear) await clearAccessTokenJson();

  const accessToken = await readAccessTokenJson();
  if (accessToken.access_token !== "") return accessToken.access_token;
  console.log("call accessTokenURL");
  const accessTokenURL = `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${process.env.WECHAT_CORPID}&corpsecret=${process.env.WECHAT_CORPSECRET}`;

  try {
    const response = await fetch(accessTokenURL);
    const resultData = await response.json();

    accessToken.access_token = resultData.access_token;
    writeAccessTokenJson(accessToken);

    return resultData.access_token;
  } catch (error) {
    console.error("getToken error", error);
  }
}

async function sendMessageToWeChatWork(users, message, newToken) {
  const token = await getToken(newToken);
  //console.log("token", token, "users", users, "message", message);
  const sendURL = `https://qyapi.weixin.qq.com/cgi-bin/message/send?debug=1&access_token=${token}`;
  const messageObj = {
    touser: users, //zhao, kj
    msgtype: "text",
    agentid: 1000002,
    text: {
      content: message,
    },
    safe: 0,
  };

  try {
    const strJsonData = JSON.stringify(messageObj);
    const response = await fetch(sendURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: strJsonData,
    });

    const resultMsg = await response.json();

    if (resultMsg.errcode === 42001) {
      return sendMessageToWeChatWork(users, message, true);
    }
    if (resultMsg.errcode > 0) {
      resultMsg.errmsg = "user & party & tag all invalid";
    }
    return resultMsg;
  } catch (error) {
    console.error("sendMessage error", error);
  }
}

export { getToken, sendMessageToWeChatWork };
