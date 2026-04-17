import express from "express";
import { urlResourceController } from "@controller/urlResource";

const urlResourceRouter = express.Router()

urlResourceRouter.post("/create", urlResourceController.create)
urlResourceRouter.patch("/update/:old_slug", urlResourceController.update)
urlResourceRouter.delete("/delete/:slug", urlResourceController.delete)

export { urlResourceRouter }