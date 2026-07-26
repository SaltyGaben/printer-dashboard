<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent, TableColumn, TableRow } from '@nuxt/ui'
import * as z from 'zod'
import { api } from '~~/convex/_generated/api'
import type { Doc } from '~~/convex/_generated/dataModel'
type PrintRequest = Doc<'print_request'>

const UBadge = resolveComponent('UBadge')
const errorName = "printInfo"
const open = ref(false)
const selectedRequest = ref<PrintRequest | null>(null)
const isRequestModalOpen = ref(false)

const toast = useToast()
const { submitRequest } = usePrintRequest()
const { copy } = useClipboard()

const { data: requestData, isPending } = useConvexQuery(api.request.getPrintRequests)
const { mutate: deleteRequest } = useConvexMutation(api.request.deletePrintRequest)


const columns: TableColumn<PrintRequest>[] = [
	{
		accessorKey: 'name',
		header: 'Print Name'
	},
	{
		accessorKey: 'description',
		header: 'Description',
		cell: ({ row }) =>
			h(
				'p',
				{
					class: 'block max-w-xs truncate'
				},
				row.original.description
			)
	},
	{
		accessorKey: 'link',
		header: 'Link',
		cell: ({ row }) =>
			h(
				'a',
				{
					href: row.original.link,
					target: '_blank',
					class: 'block max-w-xs truncate text-primary hover:underline'
				},
				row.original.link
			)
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const color = {
				completed: 'success' as const,
				rejected: 'error' as const,
				pending: 'neutral' as const
			}[row.getValue('status') as string]

			return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () =>
				row.getValue('status')
			)
		}
	},
	{
		accessorKey: 'requestedBy',
		header: 'Requested By'
	},
	{
		accessorKey: 'uploadedAt',
		header: 'Request Date',
		cell: ({ row }) => {
			const date = new Date(row.getValue('uploadedAt'))
			return date.toLocaleDateString()
		}
	},
	{
		accessorKey: 'actions',
		header: 'Actions'
	},
]

const schema = z.object({
	name: z.string(),
	description: z.optional(z.string()),
	link: z.optional(z.string()),
	file: z.optional(z.file())
}).refine((data) => 
	Boolean(
		data.description?.trim() ||
		data.link?.trim() ||
		data.file
	), {
	message: "Fill in at least one field that describes the print (description, link or file)",
	path: ["printInfo"],
}
)

export type RequestSchema = z.output<typeof schema>

const state = reactive<Partial<RequestSchema>>({
	name: undefined,
	description: undefined,
	link: undefined
})

const contactError = ref<string>()

const onError = (event: FormErrorEvent) => {	
	contactError.value = event.errors.find(
		(error) => error.name === errorName,
	)?.message
}

const onSubmit = async (event: FormSubmitEvent<RequestSchema>) => {
	contactError.value = undefined

	submitRequest(event.data)

	open.value = false
}

watch(open, () => {
	if(open.value === false) {
		state.name = undefined
		state.description = undefined
		state.link = undefined
		state.file = undefined
	}
})

const downloadFile = (request: PrintRequest) => {
	if (!request.storageId || !request.name) {
		return
	}

	const url =
        `/api/request/download-request?storageId=${encodeURIComponent(request.storageId.toString())}&filename=${encodeURIComponent(request.name)}`

	window.open(url, "_blank")
}

const removeRequest = (request: PrintRequest) => {
	deleteRequest({ id: request._id })
}

const copyLink = async (link?: string) => {
	if (!link) return

	await copy(link)

	toast.add({
		title: 'Link copied',
		color: 'success'
	})
}

const openRequestModal = (_e: Event, row: TableRow<PrintRequest> | null) => {
	if(row?.original) {
		selectedRequest.value = row?.original
		isRequestModalOpen.value = true
	}
}

</script>

<template>
	<div>
		<UHeader class="bg-transparent">
			<template #title>
				<h1 class="text-2xl font-medium">Print Requests</h1>
			</template>

			<template #right>
				<UModal v-model:open="open" title="Print Request" description="Create a new print request. Fill in as much information as possible. At least one of Description, Link, or File is required.">
					<UTooltip text="Request a new print">
						<UButton
							trailing-icon="i-lucide-plus"
							aria-label="New Print"
						>New Print</UButton>
					</UTooltip>

					<template #body>
						<UForm
							:schema="schema"
							:state="state"
							class="flex flex-col gap-4"
							@error="onError"
							@submit="onSubmit"
						>
							<UAlert
								v-if="contactError"
								color="error"
								variant="soft"
								icon="i-lucide-circle-alert"
								title="Print information required"
								:description="contactError"
							/>

							<UFormField label="Name" name="name" required>
								<UInput v-model="state.name" class="w-full"/>
							</UFormField>

							<UFormField label="Description" name="description">
								<UTextarea  v-model="state.description" class="w-full" placeholder="Type a description of the print..." />
							</UFormField>
							
							<UFormField label="Link" name="link">
								<UInput v-model="state.link" class="w-full"/>
							</UFormField>

							<UFormField label="File">
								<UFileUpload
									v-model="state.file"
									highlight
									color="primary"
									accept=".stl,.3mf,.obj"
									position="inside"
									layout="list"
									label="Drop files here or click to upload your print"
									description="Supported format: .stl, .3mf, .obj"
									size="md"/>
							</UFormField>

							<UButton class="place-self-end w-fit" type="submit">Submit</UButton>
						</UForm>
					</template>
				</UModal>
			</template>
		</UHeader>
		<div>
			<UTable
				:columns="columns"
				:data="requestData"
				:loading="isPending"
				:ui="{
					tr: 'cursor-pointer'
				}"
				@select="openRequestModal">
				<template #actions-cell="{ row }">
					<div class="flex flex-row gap-2">
						<UTooltip text="Copy Link">
							<UButton
								:disabled="row.original.link === undefined"
								icon="i-lucide-copy"
								variant="ghost"
								@click="copyLink(row.original.link)" />
						</UTooltip>

						<UTooltip text="Download File">
							<UButton
								:disabled="row.original.storageId === undefined"
								icon="i-lucide-download"
								variant="ghost"
								@click="downloadFile(row.original)" />
						</UTooltip>

						<UTooltip text="Remove Request">
							<UButton
								icon="i-lucide-trash-2"
								variant="ghost"
								color="error"
								@click="removeRequest(row.original)" />
						</UTooltip>
					</div>
				</template>
			</UTable>
		</div>
		<UModal v-model:open="isRequestModalOpen" :title="selectedRequest?.name">
			<template #body>
				<div class="space-y-4">
					<div>
						<p class="text-sm text-muted">Description</p>
						<p>{{ selectedRequest?.description || 'No description' }}</p>
					</div>

					<div v-if="selectedRequest?.link">
						<p class="text-sm text-muted">Link</p>

						<a
							:href="selectedRequest.link"
							target="_blank"
							rel="noopener noreferrer"
							class="text-primary hover:underline"
						>
							{{ selectedRequest.link }}
						</a>
					</div>

					<div>
						<p class="text-sm text-muted">Status</p>
						<p>{{ selectedRequest?.status }}</p>
					</div>
				</div>
			</template>
		</UModal>
	</div>
</template>