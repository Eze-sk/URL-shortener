import express from "express"
import { urlResourceRouter } from "@/router/urlResource"
import { navigationController } from "@controller/navigation";
import { generalLimiter } from "@/rateLimit";
import { ORIGIN_URL, PORT } from "@/consts/config";
import { connectionRedis } from "@db/connectionRedis";
import cors from "cors"

await connectionRedis()

const app = express()

app.use(cors({
  origin: ORIGIN_URL,
  optionsSuccessStatus: 200
}))

app.use(express.json());
app.use(generalLimiter)

app.set('trust proxy', 1);

app.use("/api/url-shortener", urlResourceRouter)

app.use("/:shortId", navigationController)

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})