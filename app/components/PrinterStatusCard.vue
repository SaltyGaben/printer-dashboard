<script setup lang="ts">
import type { PrinterStatus } from '~~/server/utils/printer-mqtt'

defineProps<{
	status?: PrinterStatus
}>()

const pwmToPercent = (value?: string) => {
	if (value === undefined) {
		return 0
	}

	return Math.round((Number(value) / 255) * 100)
}

</script>

<template>
	<UCard variant="soft" class="w-full h-fit">
		<template #header>
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-semibold">Status</h1>
					<p class="text-sm text-muted">Live printer telemetry</p>
				</div>
			</div>
		</template>

		<div class="space-y-6">
			<div class="space-y-2">
				<p class="text-lg font-semibold">Temperatures</p>

				<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
					<UCard variant="subtle">
						<p class="text-sm text-muted">Nozzle</p>
						<p class="text-xl font-semibold">
							{{ status?.nozzleTemp ?? "-" }} / {{ status?.nozzleTarget ?? "-" }} °C
						</p>
					</UCard>

					<UCard variant="subtle">
						<p class="text-sm text-muted">Bed</p>
						<p class="text-xl font-semibold">
							{{ status?.bedTemp ?? "-" }} / {{ status?.bedTarget ?? "-" }} °C
						</p>
					</UCard>

					<UCard variant="subtle">
						<p class="text-sm text-muted">Chamber</p>
						<p class="text-xl font-semibold">
							{{ status?.chamberTemp ?? "-" }} °C
						</p>
					</UCard>
				</div>
			</div>

			<USeparator />

			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">Fans</h3>
					<UBadge variant="soft" color="neutral">PWM</UBadge>
				</div>

				<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					<div class="rounded-lg border border-default p-3">
						<p class="text-sm text-muted">Model Fan</p>
						<p class="text-lg font-semibold">
							{{ pwmToPercent(status?.modelFan) }}%
						</p>
					</div>

					<div class="rounded-lg border border-default p-3">
						<p class="text-sm text-muted">Aux Fan</p>
						<p class="text-lg font-semibold">
							{{ pwmToPercent(status?.assistanceFan) }}%
						</p>
					</div>

					<div class="rounded-lg border border-default p-3">
						<p class="text-sm text-muted">Case Fan</p>
						<p class="text-lg font-semibold">
							{{ pwmToPercent(status?.caseFan) }}%
						</p>
					</div>

					<div class="rounded-lg border border-default p-3">
						<p class="text-sm text-muted">Controller Fan</p>
						<p class="text-lg font-semibold">
							{{ pwmToPercent(status?.controllerFan) }}%
						</p>
					</div>

					<div class="rounded-lg border border-default p-3">
						<p class="text-sm text-muted">Heater Fan</p>
						<p class="text-lg font-semibold">
							{{ pwmToPercent(status?.heaterFan) }}%
						</p>
					</div>
				</div>
			</div>
		</div>
	</UCard>
</template>