<script setup lang="ts">
import { SignUp } from '@clerk/nuxt/components'

definePageMeta({
	layout: 'no-dashboard'
})

</script>

<template>
	<div class="flex flex-col items-center justify-center min-h-screen">
		<SignUp />
	</div>
</template>