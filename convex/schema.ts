import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	users: defineTable({
		externalId: v.string(),
		discordId: v.optional(v.string()),
		username: v.string(),
		avatarUrl: v.string(),
		role: v.optional(v.union(v.literal('viewer'), v.literal('admin'))),
	}).index("by_externalId", ["externalId"]) 
})