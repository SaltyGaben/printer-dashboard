<script setup lang="ts">
import { SignUp } from '@clerk/nuxt/components'

definePageMeta({
	layout: 'no-dashboard'
})

</script>

<template>
	<div class="flex flex-col items-center justify-center gap-10 min-h-screen">
		<div class="flex flex-col items-center gap-2">
			<h1 class="text-4xl">Välkommen till Hampus 3D printing</h1>
			<p class="text-muted">Skapa ett konto eller klicka på Sign in för att logga in</p>
		</div>
		<SignUp />
	</div>
</template>