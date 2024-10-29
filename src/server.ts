import express from "express"
import mongoose from "mongoose"
import { TEST, database, server } from "./config"
import UsersController from "./controllers/users"
import { useController } from "./decorators/router"
import { logger } from "./helpers/logger"
import { ErrorHandlerMiddleware } from "./middlewares/errorHandler"
import { LoggerMiddleware } from "./middlewares/logger"
import routeNotFound from "./middlewares/routeNotFound"

const app = express()

const main = async () => {
  logger.info("Initializing server")
  app.use(express.urlencoded({ extended: false }))
  app.use(express.json())

  app.use(LoggerMiddleware)

  logger.debug("Defining controllers")
  useController(UsersController, app)

  app.use(routeNotFound)
  app.use(ErrorHandlerMiddleware)

  if (!TEST) {
    logger.info(`Connecting to Mongo on ${database.HOST}:${database.PORT}`)
    try {
      await mongoose.connect(database.URI)
      const info = await mongoose.connection.db?.admin().buildInfo()
      logger.info(`MongoDB version: ${info?.version || "unknown"}`)
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }

    try {
      logger.info(`Starting the server on ${server.HOST}:${server.PORT}`)
      app.listen(server.PORT, server.HOST, () => {
        logger.info(`listening on ${server.HOST}:${server.PORT}`)
      })
    } catch (err) {
      logger.error(err)
      process.exit(1)
    }
  }
}

main()

export default app
