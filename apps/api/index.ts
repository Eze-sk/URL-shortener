import cors from "cors";
import express from "express";
import { auth } from "@libs/auth";
import { toNodeHandler } from "better-auth/node";
import { connectionRedis } from "@db/connectionRedis";
import { navigationController } from "@controller/navigation";

import { ORIGIN_URL, PORT } from "@consts/config";

import { generalLimiter } from "@/rateLimit";

import { urlResourceRouter } from "@/router/urlResource";
import { userSessionMiddleware } from "@middleware/userSession";
import { protectFieldsMiddleware } from "@middleware/protectFields";

await connectionRedis()

const app = express()

app.use(cors({
  origin: ORIGIN_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter)

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(userSessionMiddleware)

app.use("/api/url-shortener", protectFieldsMiddleware, urlResourceRouter)
app.use("/:shortId", navigationController)

app.set('trust proxy', 1);

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})