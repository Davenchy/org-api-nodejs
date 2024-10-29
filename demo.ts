import { createLogger, format, transports } from "winston"

const logger = createLogger({
  level: "info",
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.printf((info) => {
      const { level, message } = info
      return `demo: ${level}: ${message}`
    }),
  ),
})

logger.info("fuck")
logger.error("hell")
logger.warn("asshole")
