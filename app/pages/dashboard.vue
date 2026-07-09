<script setup lang="ts">
import LogCard from '~/components/LogCard.vue'
import type { PrinterStatus } from '~~/server/utils/printer-mqtt'

const { public: { printerIp } } = useRuntimeConfig()

const videoUrl = ref("")
const cameraMinimized = ref(false)

const { data: status, refresh } = await useFetch<PrinterStatus>("/api/printer/status")

useIntervalFn(() => {
	refresh()
}, 5000)

const openCamera = async () => {
	videoUrl.value = `http://${printerIp}:8080/video`
}

const closeCamera = () => {
	videoUrl.value = ""
}

const changeCameraStatus = async () => {
	cameraMinimized.value = !cameraMinimized.value

	if (cameraMinimized.value) {
		closeCamera()
		return
	}

	await openCamera()
}

onMounted(openCamera)

onBeforeUnmount(closeCamera)
</script>

<template>
	<div class="grid grid-cols-2 gap-10">
		<PrintingStatusCard :status="status?.activePrint" :progress="status?.progress"/>
		<UCard variant="soft" class="w-full h-fit">
			<template #header>
				<div class="flex justify-between">
					<div>
						<h1 class="text-2xl font-semibold">Camera</h1>
						<p class="text-sm text-muted">Live printer camera feed</p>
					</div>
					<UButton :icon="cameraMinimized ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" variant="ghost" @click="changeCameraStatus"/>
				</div> 
			</template>
			<img
				v-if="videoUrl && !cameraMinimized"
				:key="videoUrl"
				:src="videoUrl"
				alt="Printer Camera"
				class="w-full"
			>
		</UCard>
		<PrinterStatusCard :status="status"/>
		<LogCard :data="status" />
	</div>
</template>