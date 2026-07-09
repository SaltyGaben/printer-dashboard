import mqtt from "mqtt"

export type ActivePrint = {
	printDuration?: number
	remainingTime?: number
	totalDuration?: number
	currentLayer?: number
	fileName?: string
	state?: string
}

export type PrinterStatus = {
	nozzleTemp?: number
	nozzleTarget?: number
	bedTemp?: number
	bedTarget?: number
	chamberTemp?: number
	progress?: number
	filename?: string
	modelFan?: string
	assistanceFan?: string
	caseFan?: string
	controllerFan?: string
	heaterFan?: string
	status?: string
	activePrint?: ActivePrint
}

let latestStatus: PrinterStatus = {}
let client: mqtt.MqttClient | null = null
let requestId = 0
let serial: string | null = null
let pingInterval: ReturnType<typeof setInterval> | null = null

let printerState: Record<string, any> = {}

const deepMerge = (target: any, source: any): any => {
	for (const key in source) {
		if (
			source[key] &&
			typeof source[key] === "object" &&
			!Array.isArray(source[key])
		) {
			target[key] ??= {}
			deepMerge(target[key], source[key])
		} else {
			target[key] = source[key]
		}
	}

	return target
}

const clientId = `1_PC_${Math.floor(Math.random() * 10 ** 14)}`
const requestIdPrefix = `${clientId}_req`

const mapStatus = (result: any): PrinterStatus => ({
	nozzleTemp: result?.extruder?.temperature,
	nozzleTarget: result?.extruder?.target,
	bedTemp: result?.heater_bed?.temperature,
	bedTarget: result?.heater_bed?.target,
	chamberTemp: result?.ztemperature_sensor?.temperature,
	progress: result?.machine_status?.progress,
	filename: result?.print_status?.filename,
	modelFan: result?.fans?.fan?.speed,
	assistanceFan: result?.fans?.aux_fan?.speed,
	caseFan: result?.fans?.box_fan?.speed,
	controllerFan: result?.fans?.controller_fan?.speed,
	heaterFan: result?.fans?.heater_fan?.speed,
	status: result?.machine_status?.status,
	activePrint: {
		printDuration: result?.print_status?.print_duration,
		remainingTime: result?.print_status?.remaining_time_sec,
		totalDuration: result?.print_status?.total_duration,
		currentLayer: result?.print_status?.current_layer,
		fileName: result?.print_status?.filename,
		state: result?.print_status?.state
	}
})

const isPlainObject = (value: unknown): value is Record<string, any> => {
	return !!value && typeof value === "object" && !Array.isArray(value)
}

const mergeDefined = (
	current: Record<string, any>,
	patch: Record<string, any>,
): Record<string, any> => {
	const next: Record<string, any> = { ...current }

	for (const [key, value] of Object.entries(patch)) {
		if (value === undefined) {
			continue
		}

		if (isPlainObject(value) && isPlainObject(next[key])) {
			next[key] = mergeDefined(next[key], value)
			continue
		}

		next[key] = value
	}

	return next
}

const mergeStatus = (partialStatus: PrinterStatus) => {
	latestStatus = mergeDefined(latestStatus, partialStatus)
}

export const getPrinterMqtt = () => {
	if (client) {
		return client
	}

	const config = useRuntimeConfig()

	const host = config.public.printerIp
	const accessCode = config.printerAccessCode
	serial = config.printerSerial

	if (!host || !accessCode || !serial) {
		throw new Error("Missing printer env vars")
	}

	client = mqtt.connect(`mqtt://${host}:1883`, {
		clientId,
		username: "elegoo",
		password: accessCode,
		protocolVersion: 4,
		keepalive: 60,
	})

	client.on("connect", () => {
		client?.subscribe(`elegoo/${serial}/#`)

		client?.publish(
			`elegoo/${serial}/api_register`,
			JSON.stringify({
				client_id: clientId,
				request_id: requestIdPrefix,
			}),
		)

		if (!pingInterval) {
			pingInterval = setInterval(() => {
				client?.publish(
					`elegoo/${serial}/${clientId}/api_request`,
					JSON.stringify({ type: "PING" }),
				)
			}, 30_000)
		}

		requestStatus()
	})

	client.on("message", (_topic, payload) => {
		const data = JSON.parse(payload.toString())

		printerState = deepMerge(printerState, data)

		const partialStatus = mapStatus(data.result ?? data)

		mergeStatus(partialStatus)
	})

	return client
}

export const requestStatus = () => {
	if (!client || !serial) {
		return
	}

	requestId++

	client.publish(
		`elegoo/${serial}/${clientId}/api_request`,
		JSON.stringify({
			id: requestId,
			method: 1002,
			params: {},
		}),
	)
}

export const getLatestPrinterStatus = () => latestStatus