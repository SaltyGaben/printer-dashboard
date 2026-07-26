import type { RequestSchema } from '~/pages/requests.vue'
import { api } from '~~/convex/_generated/api'
import type { Id } from '~~/convex/_generated/dataModel'

export const usePrintRequest = () => {
	const convex = useConvexClient()

	const submitRequest = async (form: RequestSchema) => {
		const selectedFile = form.file
	
		let uploadedFile: Id<'_storage'> | undefined
	
		if (selectedFile) {
			const uploadUrl = await convex.mutation(
				api.request.generateUploadUrl,
				{}
			)
	
			const uploadResponse = await fetch(uploadUrl, {
				method: 'POST',
				headers: {
					'Content-Type':
						selectedFile.type || 'application/octet-stream'
				},
				body: selectedFile
			})
	
			if (!uploadResponse.ok) {
				throw new Error('File upload failed')
			}
	
			const result = (await uploadResponse.json()) as {
				storageId: Id<'_storage'>
			}
	
			uploadedFile = result.storageId
		}
	
		await convex.mutation(api.request.savePrintRequest, {
			name: form.name,
			description: form.description || undefined,
			link: form.link || undefined,
			storageId: uploadedFile,
			status: 'pending',
			requestedBy: 'Hampus'
		})
	}

	return { submitRequest }
}

