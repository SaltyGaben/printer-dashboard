<script setup lang="ts">
import type { PrinterStatus } from '~~/server/utils/printer-mqtt'

const { public: { printerIp } } = useRuntimeConfig()

const videoUrl = `http://${printerIp}:8080/video`

const { data: status, refresh } = await useFetch<PrinterStatus>("/api/printer/status")

useIntervalFn(() => {
	refresh()
}, 5000)

const pwmToPercent = (value?: string) => {
	if (value === undefined) {
		return 0
	}

	return Math.round((Number(value) / 255) * 100)
}
</script>

<template>
	<div class="flex flex-col sm:flex-row gap-10">
		<UCard variant="soft" class="w-full">
			<template #header>
				<h1>Status</h1>
			</template>
			<div>
				<p>Nozzle: {{ status?.nozzleTemp }} / {{ status?.nozzleTarget }} °C</p>
				<p>Bed: {{ status?.bedTemp }} / {{ status?.bedTarget }} °C</p>
				<p>Chamber: {{ status?.chamberTemp }} °C</p>
				<p>Progress: {{ status?.progress }}%</p>
			</div>
			<div>
				<p>Model Fan: {{ pwmToPercent(status?.modelFan) }}%</p>
				<p>Aux Fan: {{ pwmToPercent(status?.assistanceFan) }}%</p>
				<p>Case Fan: {{ pwmToPercent(status?.caseFan) }}%</p>
				<p>Controller Fan: {{ pwmToPercent(status?.controllerFan) }}%</p>
				<p>Heater Fan: {{ pwmToPercent(status?.heaterFan) }}%</p>
			</div>
		</UCard>
		<UCard variant="soft" class="w-full">
			<template #header>
				<h1>Camera</h1>
			</template>
			<img
				v-if="videoUrl"
				:src="videoUrl"
				alt="Printer Camera"
				class="h-60"
			>
		</UCard>
	</div>
</template>