import { compare, hash } from "bcrypt"
import { Schema, Types, model } from "mongoose"
import type { HydratedDocument, Model } from "mongoose"
import { SALT_ROUNDS } from "../config"
import { logger } from "../helpers/logger"
import type { IUser } from "../types/users"

export interface IUserMethods {
  validatePassword(password: string): Promise<boolean>
}

// biome-ignore lint/complexity/noBannedTypes: required by mongoose
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
  isEmailTaken(email: string): Promise<boolean>
  findByHexId(hexId: string): Promise<IUserDocument | null>
}

export type IUserDocument = HydratedDocument<IUser, IUserMethods>

export const UserSchema = new Schema<IUser, IUserModel, IUserMethods>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
    methods: {
      validatePassword: function (password: string): Promise<boolean> {
        return compare(password, this.password)
      },
    },
    statics: {
      isEmailTaken: async function (email: string): Promise<boolean> {
        return (await this.findOne({ email })) !== null
      },
      findByHexId: async function (
        hexId: string,
      ): Promise<IUserDocument | null> {
        const objectId = Types.ObjectId.createFromHexString(hexId)
        return this.findById(objectId)
      },
    },
  },
)

UserSchema.pre("save", async function () {
  try {
    this.password = await hash(this.password, SALT_ROUNDS)
  } catch (err) {
    logger.error(err)
    throw err
  }
})

export default model<IUser, IUserModel>("User", UserSchema)
