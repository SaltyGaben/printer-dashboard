export type Sensors = { 
	temperature: number
	humidity: number
}

export default defineEventHandler(async () => {
	const client = await useDirigeraClient()
	const sensors = await client.environmentSensors.list()

	return parseSensorData(sensors)
})

const parseSensorData = (sensors: any[]): Sensors => ({
	temperature:Math.round(sensors.find(
		sensor => typeof sensor.attributes.currentTemperature === "number",
	)?.attributes.currentTemperature ?? 0),

	humidity: sensors.find(
		sensor => typeof sensor.attributes.currentRH === "number",
	)?.attributes.currentRH,
})