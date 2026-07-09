import { convex } from '~~/server/utils/convex'
import { api } from '~~/convex/_generated/api'
import type { Id } from '~~/convex/_generated/dataModel'

export default defineEventHandler(async (event) => {
	const query = getQuery(event)

	const storageIdParam = query.storageId
	const filenameParam = query.filename

	if (typeof storageIdParam !== 'string' || typeof filenameParam !== 'string') {
		throw createError({
			statusCode: 400,
			statusMessage: 'Invalid query parameters'
		})
	}

	const storageId = storageIdParam as Id<"_storage">
	const filename = filenameParam

	const downloadUrl = await convex.query(api.request.getDownloadUrl, {
		storageId
	})

	if (!downloadUrl) {
		throw createError({
			statusCode: 404,
			statusMessage: 'File not found'
		})
	}

	const res = await fetch(downloadUrl)

	if (!res.ok || !res.body) {
		throw createError({
			statusCode: 500,
			statusMessage: 'Failed to fetch file'
		})
	}

	setHeader(event, 'Content-Disposition', `attachment; filename="${filename}"`)
	setHeader(event, 'Content-Type', 'application/octet-stream')

	return sendStream(event, res.body)
})