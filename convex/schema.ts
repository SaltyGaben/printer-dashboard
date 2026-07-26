import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
	users: defineTable({
		externalId: v.string(),
		discordId: v.optional(v.string()),
		username: v.string(),
		avatarUrl: v.string(),
		role: v.optional(v.union(v.literal('viewer'), v.literal('admin'))),
	}).index("by_externalId", ["externalId"]),
	print_request: defineTable({
		name: v.string(),
		description: v.optional(v.string()),
		link: v.optional(v.string()),
		storageId: v.optional(v.id("_storage")),
		status: v.union(v.literal('pending'), v.literal('completed'), v.literal('rejected')),
		requestedBy: v.string(),
		cost: v.optional(v.number()),
		weight: v.optional(v.number()),
		uploadedAt: v.number(),
	}).index('by_status', ['status'])
})