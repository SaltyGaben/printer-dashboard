import {
	getLatestPrinterStatus,
	getPrinterMqtt,
	requestStatus,
} from "../../utils/printer-mqtt"

export default defineEventHandler(() => {
	getPrinterMqtt()
	requestStatus()

	return getLatestPrinterStatus()
})