<script setup lang="ts">
import type { PrinterStatus } from '~~/server/utils/printer-mqtt'

const logData = ref(false)

defineProps<{
	data?: PrinterStatus
}>()

const changeLogStatus = () => {
	logData.value = !logData.value
}
</script>

<template>
	<UCard variant="soft" class="w-full h-fit">
		<template #header>
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-semibold">Log</h1>
					<p class="text-sm text-muted">Live logging data</p>
				</div>
				<UButton @click="changeLogStatus">Log Data {{ logData ? 'On' : 'Off' }}</UButton>
			</div>
		</template>
		<div>
			<p v-if="logData">{{ data ? data : 'No Data' }}</p>
		</div>
	</UCard>
</template>