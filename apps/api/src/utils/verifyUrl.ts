import { SAFE_BROWSING_API_KEY } from "@/consts/config";
import { logInternalError } from "@model/logInternalError";
import axios from "axios";

export async function verifyUrl({ url }: { url: string }) {
  try {
    const response = await axios.get("https://safebrowsing.googleapis.com/v5/urls:search", {
      params: {
        key: SAFE_BROWSING_API_KEY,
        urls: url
      }
    })

    const data = response.data
    const threats = data.threats || [];

    if (threats.length > 0) {
      return {
        isSafe: false,
        details: threats
      }
    }

    return {
      isSafe: true,
      cacheDuration: data.cacheDuration
    }
  } catch (err) {
    return {
      err
    }
  }
}
