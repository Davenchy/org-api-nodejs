import DotEnv from "dotenv"

DotEnv.config()

// server config
export const SERVER_PORT = Number(process.env.SERVER_PORT) || 8080
export const SERVER_HOST = process.env.SERVER_HOST || "localhost"

// database config
export const MONGO_HOST = process.env.MONGO_HOST || "localhost"
export const MONGO_PORT = process.env.MONGO_PORT || "27017"
export const MONGO_USER = process.env.MONGO_USER || "user"
export const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "pass"
export const MONGO_DB = process.env.MONGO_DB || "org_manager"
export const MONGO_URI =
  process.env.MONGO_URI || `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`

// password hashing config
export const SALT_ROUNDS = Number(process.env.HASH_ROUNDS) || 10

// JWT config
export const JWT_SECRET = process.env.JWT_SECRET || "supersecret"
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "super_refresh_secret"
export const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 300 // 5 minutes
export const JWT_REFRESH_EXPIRES_IN =
  Number(process.env.JWT_REFRESH_EXPIRES_IN) || 3600 // 1 hour

// environment config
export const DEVELOPMENT = process.env.NODE_ENV === "development"
export const TEST = process.env.NODE_ENV === "test"

// logs config
export const LOG_LEVEL = process.env.LOG_LEVEL || "http"

// group exports
export const server = {
  PORT: SERVER_PORT,
  HOST: SERVER_HOST,
}

export const database = {
  HOST: MONGO_HOST,
  PORT: MONGO_PORT,
  USER: MONGO_USER,
  PASSWORD: MONGO_PASSWORD,
  DN: MONGO_DB,
  URI: MONGO_URI,
}
