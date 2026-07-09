import type { Doc } from './_generated/dataModel'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export type PrintRequest = Doc<'print_request'>

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl()
	}
})

export const savePrintRequest = mutation({
	args: {
		storageId: v.optional(v.id("_storage")),
		name: v.string(),
		description: v.optional(v.string()),
		link: v.optional(v.string()),
		uploadedBy: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('print_request', {
			...args,
			uploadedAt: Date.now()
		})
	}
})

export const getPrintRequests = query({
	args: {},
	handler: async (ctx) => {
		return ctx.db.query('print_request').collect()
	}
})

export const getDownloadUrl = query({
	args: { storageId: v.id("_storage") },
	handler: async (ctx, { storageId }) => {
		return await ctx.storage.getUrl(storageId)
	}
})

export const deletePrintRequest = mutation({
	args: { id: v.id('print_request') },
	handler: async (ctx, { id }) => {
		const print = await ctx.db.get(id)
		if (!print) return

		if(print.storageId) {
			await ctx.storage.delete(print.storageId)
		}

		await ctx.db.delete(id)
	}
})