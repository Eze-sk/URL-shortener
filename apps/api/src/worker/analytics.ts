import type { UrlGetType } from "@model/urlResource";
import { urlAnalyticsModel } from "@model/urlAnalytics";

declare var self: Worker;

type metadata = {
  ua: string
  country: string
  referer: string
}

self.onmessage = (event) => {
  const { id, ua, country, referer } = event.data as UrlGetType & metadata

  urlAnalyticsModel.create({
    id, user_agent: ua, country, referer
  })
}