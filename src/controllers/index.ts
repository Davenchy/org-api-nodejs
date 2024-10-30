import { Router } from "express"
import type { Express } from "express"
import UsersController from "./users"
import OrgsController from "./organizations"
import { useController } from "../decorators/router"

const router = Router()

useController([UsersController, OrgsController], router as Express)

export default router
