import geoip from "geoip-lite";
import { isPast } from "date-fns";
import type { Request, Response } from "express";
import { redisClient } from "@db/connectionRedis";
import { logInternalError } from "@model/logInternalError";
import { urlResourceModel, type UrlGetType } from "@model/urlResource";

interface NavParams {
  shortId: string
}

export async function navigationController(req: Request<NavParams>, res: Response) {
  const short_url: string = req.params.shortId

  if (!short_url) {
    return res.status(404).json({ error: 'The page was not found.' })
  }

  const ua = req.get("User-Agent") ?? "unknowns"

  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const ip = Array.isArray(rawIp) ? rawIp[0] : rawIp?.split(',')[0] || "";

  const geo = geoip.lookup(ip?.toString() ?? "")
  const country = geo?.country ?? "unknowns"

  const referer = req.get('Referer') || 'Directo';

  const cacheKey = `url:${short_url}`

  try {

    let result: UrlGetType
    const cached = await redisClient.get(cacheKey)

    if (cached) {
      result = JSON.parse(cached)
    } else {
      result = await urlResourceModel.get({ short_url })

      if (!result) {
        return res.status(404).json({ error: 'The page was not found.' })
      }

      await redisClient.set(cacheKey, JSON.stringify(result), { EX: 7200 })
    }

    if (result?.expires_at && isPast(new Date(result?.expires_at))) {
      await urlResourceModel.delete({ short_url })
      return res.status(410).json({ error: 'This link has expired and is no longer available.' });
    }

    const worker = new Worker(
      new URL("../worker/analytics.ts", import.meta.url).href,
      { type: "module" }
    );

    worker.postMessage(
      {
        id: result?.id,
        ua,
        country,
        referer
      }
    )

    res.redirect(result?.original_url ?? "")
  } catch (err) {
    await logInternalError.create({ err, context: "URL_CONTROLLER_NAVIGATION" })
    return res.status(500).json({ message: "Internal error" })
  }
}