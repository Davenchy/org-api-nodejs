import { logger as createLoggerMiddleware, errorLogger } from "express-winston"
import { logger } from "../helpers/logger"

export const LoggerMiddleware = createLoggerMiddleware({
  level: "http",
  winstonInstance: logger,
})

export const ErrorLoggerMiddleware = errorLogger({
  winstonInstance: logger,
})
