import { internalMutation, internalQuery, mutation, query, type QueryCtx } from './_generated/server'
import type { WithoutSystemFields } from 'convex/server'
import type { UserJSON } from '@clerk/backend'
import type { Doc } from './_generated/dataModel'
import { v, type Validator } from 'convex/values'


export const current = query({
	args: {},
	handler: async (ctx) => {
		return await getCurrentUser(ctx)
	}
})

export const getAllUsers = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query('users').collect()
	}
})

export const addRole = mutation({
	args: {
		roletoAdd: v.union(v.literal('viewer'), v.literal('admin')),
		id: v.id('users')
	},
	handler: async (ctx, { id, roletoAdd }) => {
		const user = await ctx.db.get(id)
		if (!user) throw new Error('User not found')

		await ctx.db.patch(id, { role: roletoAdd })

		return { success: true }
	}
})

export const removeRole = mutation({
	args: {
		id: v.id('users')
	},
	handler: async (ctx, { id }) => {
		const user = await ctx.db.get(id)
		if (!user) throw new Error('User not found')

		await ctx.db.patch(id, { role: undefined })

		return { success: true }
	}
})

export const getUser = query({
	args: {
		id: v.id('users')
	},
	handler: async (ctx, { id }) => {
		return await ctx.db.get(id)
	}
})

export const upsertFromClerk = internalMutation({
	args: { data: v.any() as Validator<UserJSON> },
	async handler(ctx, { data }) {
		const userAttributes: WithoutSystemFields<Doc<'users'>> = {
			username: data.external_accounts[0]?.username ?? '',
			discordId: data.external_accounts[0]?.id,
			externalId: data.id,
			avatarUrl: data.external_accounts[0]?.image_url ?? '',
			role: 'viewer'
		}

		const user = await userByExternalId(ctx, data.id)
		if (user === null) {
			await ctx.db.insert('users', userAttributes)
		} else {
			await ctx.db.patch(user._id, userAttributes)
		}
	}
})

export const deleteFromClerk = internalMutation({
	args: { clerkUserId: v.string() },
	async handler(ctx, { clerkUserId }) {
		const user = await userByExternalId(ctx, clerkUserId)

		if (user !== null) {
			await ctx.db.delete(user._id)
		} else {
			console.warn(`Can't delete user, there is none for Clerk user ID: ${clerkUserId}`)
		}
	}
})

export const getCurrentUserOrThrow = async (ctx: QueryCtx) => {
	const userRecord = await getCurrentUser(ctx)
	if (!userRecord) throw new Error("Can't get current user")
	return userRecord
}

export const getCurrentUser = async (ctx: QueryCtx) => {
	const identity = await ctx.auth.getUserIdentity()
	if (identity === null) {
		return null
	}
	return await userByExternalId(ctx, identity.subject)
}

const userByExternalId = async (ctx: QueryCtx, externalId: string) => {
	return await ctx.db
		.query('users')
		.withIndex('by_externalId', (q) => q.eq('externalId', externalId))
		.unique()
}

export const getUserByExternalId = internalQuery({
	args: { externalId: v.string() },
	async handler(ctx, { externalId }) {
		return await userByExternalId(ctx, externalId)
	}
})

export const getAccessState = query({
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity()
		if (!identity) {			
			return null
		}

		return await userByExternalId(ctx, identity.subject)
	}
})