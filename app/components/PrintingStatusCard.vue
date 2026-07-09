<script setup lang="ts">
import type { ActivePrint } from '~~/server/utils/printer-mqtt'

defineProps<{
	status?: ActivePrint
	progress?: number
}>()

const formatDuration = (seconds?: number) => {
	if (!seconds) {
		return "-"
	}

	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)

	return `${hours}h ${minutes}m`
}

</script>

<template>
	<UCard variant="soft" class="w-full">
		<template #header>
			<div class="flex items-start justify-between gap-4">
				<div class="min-w-0">
					<p class="text-sm text-muted">Active Print</p>

					<h2 class="truncate text-xl font-semibold">
						{{ status?.fileName || "No active print" }}
					</h2>
				</div>

				<UBadge
					:color="status?.state === 'printing'
						? 'success'
						: status?.state === 'paused'
							? 'warning'
							: status?.state === 'error'
								? 'error'
								: 'neutral'"
					variant="soft"
				>
					{{ status?.state ?? "Idle" }}
				</UBadge>
			</div>
		</template>

		<div class="space-y-6">
			<div>
				<div class="mb-2 flex items-center justify-between">
					<span class="text-sm text-muted">Progress</span>

					<span class="text-sm font-medium">
						{{ progress }}%
					</span>
				</div>

				<UProgress
					:model-value="progress"
					:max="100"
					status
				/>
			</div>

			<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<UCard variant="subtle">
					<p class="text-xs text-muted uppercase tracking-wide">
						Elapsed
					</p>

					<p class="mt-1 text-lg font-semibold">
						{{ formatDuration(status?.printDuration) }}
					</p>
				</UCard>

				<UCard variant="subtle">
					<p class="text-xs text-muted uppercase tracking-wide">
						Remaining
					</p>

					<p class="mt-1 text-lg font-semibold">
						{{ formatDuration(status?.remainingTime) }}
					</p>
				</UCard>

				<UCard variant="subtle">
					<p class="text-xs text-muted uppercase tracking-wide">
						Total Time
					</p>

					<p class="mt-1 text-lg font-semibold">
						{{ formatDuration(status?.totalDuration) }}
					</p>
				</UCard>

				<UCard variant="subtle">
					<p class="text-xs text-muted uppercase tracking-wide">
						Layer
					</p>

					<p class="mt-1 text-lg font-semibold">
						{{ status?.currentLayer ?? "-" }}
					</p>
				</UCard>
			</div>
		</div>
	</UCard>
</template>