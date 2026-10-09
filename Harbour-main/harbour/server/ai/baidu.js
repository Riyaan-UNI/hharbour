import { createHash } from "node:crypto";

export async function translateToCantonese(text) {
  const { BAIDU_APP_ID: appId, BAIDU_SECRET_KEY: secret } = process.env;
  if (!appId || !secret) throw new Error("Translation is not configured. Add Baidu credentials in server/.env.");
  const salt = String(Date.now());
  const sign = createHash("md5").update(`${appId}${text}${salt}${secret}`).digest("hex");
  const params = new URLSearchParams({ q: text, from: "auto", to: "yue", appid: appId, salt, sign });
  const response = await fetch(`https://fanyi-api.baidu.com/api/trans/vip/translate?${params}`);
  const data = await response.json();
  if (!response.ok || data.error_code || !data.trans_result?.length) throw new Error(data.error_msg || "Translation failed.");
  return data.trans_result.map((part) => part.dst).join("\n");
}
