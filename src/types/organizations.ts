import { z } from "zod"

export const OrgPayloadSchema = z.object({
  name: z.string({ message: "organization name is required" }).min(3),
  description: z.string({
    message: "organization description field is missing",
  }),
})

export const OrgInviteSchema = z.object({
  user_email: z.string().email("email is required"),
})

export type IOrgPayload = z.infer<typeof OrgPayloadSchema>
export type IOrgInvite = z.infer<typeof OrgInviteSchema>

export const memberAccessLevels = ["admin", "member"] as const
export type MemberAccessLevelsTuple = typeof memberAccessLevels
export type MemberAccessLevel = MemberAccessLevelsTuple[number]

export interface IOrgMember {
  name: string
  email: string
  access_level: MemberAccessLevel
}

export interface IOrg extends IOrgPayload {
  organization_id: string
  organization_members: IOrgMember[]
}
