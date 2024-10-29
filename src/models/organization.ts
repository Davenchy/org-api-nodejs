import { Schema, Types, model } from "mongoose"
import type { HydratedDocument, Model } from "mongoose"
import {
  type IOrg,
  type IOrgMember,
  memberAccessLevels,
} from "../types/organizations"

interface IOrgVirtuals {
  organization_id: string
}

export type IOrgDocument = HydratedDocument<IOrg & IOrgVirtuals>

export const OrgMemberSchema = new Schema<IOrgMember>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    access_level: { type: String, default: "member", enum: memberAccessLevels },
  },
  { _id: false },
)

export const OrgSchema = new Schema<IOrg & IOrgVirtuals>(
  {
    name: { type: String, required: true, min: 3 },
    description: { type: String, required: true },
    organization_members: [OrgMemberSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    virtuals: {
      organization_id: {
        get(): string {
          return this._id.toHexString()
        },
      },
    },
  },
)

export default model<IOrg & IOrgVirtuals>("Organization", OrgSchema)
