import cors from "cors";
import express from "express";
import { auth } from "@libs/auth";
import { toNodeHandler } from "better-auth/node";
import { connectionRedis } from "@db/connectionRedis";
import { navigationController } from "@controller/navigation";

import { BASE_URL, PORT } from "@consts/config";

import { generalLimiter } from "@/rateLimit";

import { urlResourceRouter } from "@/router/urlResource";

await connectionRedis()

const app = express()

app.use(cors({
  origin: BASE_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  optionsSuccessStatus: 200
}))

app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(generalLimiter)

app.use("/api/url-shortener", urlResourceRouter)
app.use("/:shortId", navigationController)
app.all("/api/auth/*splat", toNodeHandler(auth));

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})