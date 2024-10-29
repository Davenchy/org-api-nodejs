import { sign, verify } from "jsonwebtoken"
import mongoose from "mongoose"
import request from "supertest"
import { MONGO_HOST, MONGO_PORT } from "../../src/config"
import { generateTokens, validateToken } from "../../src/helpers/tokens"
import User from "../../src/models/user"
import app from "../../src/server"

const userInfo = {
  name: "test",
  email: "test@example.dev",
}
const validPassword = "@Test123456789"
const invalidPassword = "123456789"

beforeAll(async () => {
  await mongoose.connect(`mongodb://${MONGO_HOST}:${MONGO_PORT}/test`)
  await mongoose.connection.db?.dropDatabase()
})

describe("Signup", () => {
  beforeAll(async () => mongoose.connection.db?.dropDatabase())

  it.each([
    { user: {}, status: 400, neg: "not", case: "without all required fields" },
    {
      user: { name: "test", email: "test", password: "test" },
      status: 400,
      neg: "not",
      case: "with invalid email",
    },
    {
      user: { ...userInfo, password: invalidPassword },
      status: 400,
      neg: "not",
      case: "with invalid password",
    },
    {
      user: { ...userInfo, password: validPassword },
      status: 201,
      neg: "",
      case: "",
    },
    {
      user: { ...userInfo, password: validPassword },
      status: 409,
      neg: "not",
      case: "with a taken email",
    },
  ])("should $neg signup a new user $case", ({ user, status }, done) => {
    request(app).post("/signup").send(user).expect(status, done)
  })
})

describe("Login", () => {
  beforeAll(async () => {
    await mongoose.connection.db?.dropDatabase()
    await new User({ ...userInfo, password: validPassword }).save()
  })

  it.each([
    {
      cred: { email: "test", password: "test" },
      case: "invalid email",
      status: 400,
    },
    {
      cred: { email: userInfo.email, password: "test" },
      case: "invalid password",
      status: 400,
    },
    {
      cred: { email: userInfo.email, password: `${validPassword}x` },
      case: "incorrect credentials",
      status: 401,
    },
  ])("should not login with $case", ({ cred, status }, done) => {
    request(app).post("/signin").send(cred).expect(status, done)
  })

  it("should login with correct credentials and respond with tokens", (done) => {
    request(app)
      .post("/signin")
      .send({ email: userInfo.email, password: validPassword })
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) return done(err)

        expect(res.body).toMatchObject({
          message: expect.any(String),
          token: expect.any(String),
          refresh_token: expect.any(String),
        })

        done()
      })
  })
})

describe("Refresh Token", () => {
  beforeAll(async () => {
    await mongoose.connection.db?.dropDatabase()
    await new User({ ...userInfo, password: validPassword }).save()
  })

  afterEach(() => jest.useRealTimers())

  it("should login", async () => {
    const res = await request(app)
      .post("/signin")
      .send({ email: userInfo.email, password: validPassword })
      .expect(200)

    expect(res.body.token).toBeDefined()
    expect(res.body.refresh_token).toBeDefined()

    expect(await validateToken(res.body.token)).not.toBeNull()
  })

  it("should token be expired", async () => {
    jest
      .useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] })
      .setSystemTime(Date.now() - 2 * 3600 * 1000)

    // @ts-ignore
    const tokens = generateTokens({
      _id: new mongoose.Types.ObjectId(),
      email: "test@example.dev",
    })

    jest.useRealTimers()

    expect(await validateToken(tokens.token)).toBeNull()

    // Fale the time and travel 1 hour to the past
    jest
      .useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] })
      .setSystemTime(Date.now() - 3600 * 1000)

    // request tokens in the past
    const res = await request(app)
      .post("/signin")
      .send({ email: userInfo.email, password: validPassword })
      .expect(200)

    expect(res.body.token).toBeDefined()
    expect(res.body.refresh_token).toBeDefined()

    // return to future
    jest.useRealTimers()

    // expected that the token is not valid in the future
    expect(await validateToken(res.body.token)).toBeNull()
  })

  it("should refresh tokens", async () => {
    const signInRes = await request(app)
      .post("/signin")
      .send({ email: userInfo.email, password: validPassword })
      .expect(200)

    expect(signInRes.body.token).toBeDefined()
    expect(signInRes.body.refresh_token).toBeDefined()

    const refreshRes = await request(app)
      .post("/refresh-token")
      .send({ refresh_token: signInRes.body.refresh_token })
      .expect(200)

    expect(refreshRes.body.token).toBeDefined()
    expect(refreshRes.body.refresh_token).toBeDefined()
  })

  it("should not refresh expired refresh token", async () => {
    // fake time
    jest
      .useFakeTimers({ doNotFake: ["nextTick", "setImmediate"] })
      .setSystemTime(Date.now() - 2 * 3600 * 1000)

    const signInRes = await request(app)
      .post("/signin")
      .send({ email: userInfo.email, password: validPassword })
      .expect(200)

    expect(signInRes.body.token).toBeDefined()
    expect(signInRes.body.refresh_token).toBeDefined()

    jest.useRealTimers()

    await request(app)
      .post("/refresh-token")
      .send({ refresh_token: signInRes.body.refresh_token })
      .expect(401)
  })
})
