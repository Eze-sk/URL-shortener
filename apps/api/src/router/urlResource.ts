import express from "express";
import { urlResourceController } from "@controller/urlResource";

const urlResourceRouter = express.Router()

urlResourceRouter.post("/create", urlResourceController.create)
urlResourceRouter.post("/update", urlResourceController.update)
urlResourceRouter.post("/delete", urlResourceController.delete)

export { urlResourceRouter }