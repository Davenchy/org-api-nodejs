import { z } from "zod"

const emailSchema = z.string({ message: "email is required" }).email()
const passwordSchema = z
  .string({ message: "password is required" })
  .trim()
  .min(8, "password must be at least 8 characters")
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    "Invalid password, use symbols + numbers + capital and small letters",
  )

export const SignupSchema = z.object({
  name: z.string({ message: "name is required" }).min(3).max(30),
  email: emailSchema,
  password: passwordSchema,
})

export type ISignup = z.infer<typeof SignupSchema>
export type IUser = ISignup

export const SigninSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type ISignin = z.infer<typeof SigninSchema>

export const RefreshTokenSchema = z.object({
  refresh_token: z.string().trim(),
})

export type IRefreshToken = z.infer<typeof RefreshTokenSchema>
