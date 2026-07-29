export default defineNuxtRouteMiddleware(async (to) => {
	const publicPaths = [
		"/",
		"/not-allowed"
	]

	const isPublicPath =
		publicPaths.includes(to.path) ||
		to.path.startsWith("/sign-in") ||
		to.path.startsWith("/sign-up")

	const { isLoaded, isSignedIn } = useAuth()

	if (!isLoaded.value) {
		await new Promise<void>((resolve) => {
			const stop = watch(
				isLoaded,
				(loaded) => {
					if (loaded) {
						stop()
						resolve()
					}
				},
				{ immediate: true }
			)
		})
	}

	if (isSignedIn.value && isPublicPath) {
		return navigateTo("/dashboard")
	}

	if (!isSignedIn.value && !isPublicPath) {
		return navigateTo({
			path: "/sign-in",
			query: {
				redirect_url: to.fullPath
			}
		})
	}
})