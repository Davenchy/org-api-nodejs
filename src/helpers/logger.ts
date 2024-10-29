import { createLogger, format, transports } from "winston"
import { LOG_LEVEL } from "../config"

const baseFormat = format.combine(format.colorize(), format.timestamp())

const defaultFormat = format.combine(
  baseFormat,
  format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`
  }),
)

const httpFormat = format.combine(
  baseFormat,
  format.printf(
    ({
      timestamp,
      level,
      meta: {
        req: { url, method },
        res: { statusCode },
        responseTime,
      },
    }) =>
      `${timestamp} ${level}: ${method} ${url} -> ${statusCode} in ${responseTime}ms`,
  ),
)

export const logger = createLogger({
  level: LOG_LEVEL,
  format: format.combine(
    format((info) => {
      return info.level === "http"
        ? httpFormat.transform(info)
        : defaultFormat.transform(info)
    })(),
  ),
  transports: [new transports.Console()],
})
