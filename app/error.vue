<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

</script>

<template>
	<div class="flex flex-col items-center justify-center gap-10 min-h-screen">
		<div class="flex flex-col items-center gap-2">
			<h1 class="text-4xl">{{ error.status }}</h1>
			<p class="text-muted">{{ error.message }}</p>
		</div>
		<NuxtLink to="/dashboard" class="text-xl">Go back home</NuxtLink>
	</div>
</template>
