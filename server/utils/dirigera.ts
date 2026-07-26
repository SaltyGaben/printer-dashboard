import { createDirigeraClient } from "dirigera"

let clientPromise: ReturnType<typeof createDirigeraClient> | undefined

export const useDirigeraClient = () => {
	if (!clientPromise) {
		const config = useRuntimeConfig()

		if (!config.dirigeraAccessToken) {
			throw new Error("Missing DIRIGERA access token")
		}

		clientPromise = createDirigeraClient({
			accessToken: config.dirigeraAccessToken,
		})
	}

	return clientPromise
}