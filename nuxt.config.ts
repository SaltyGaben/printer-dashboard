// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	modules: [
		"@nuxt/ui",
		"@nuxt/devtools",
		"@nuxt/eslint",
		"convex-nuxt",
		"@vueuse/nuxt",
	],
	css: ["~/assets/css/main.css"],
	convex: {
		url: process.env.CONVEX_URL
	},
	runtimeConfig: {
		printerAccessCode: "",
		printerSerial: "",
		public: {
			printerIp: "",
		},
	},
	devtools: { enabled: true },
})