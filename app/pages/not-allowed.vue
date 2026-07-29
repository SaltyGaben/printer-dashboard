<script setup lang="ts">

definePageMeta({
	layout: 'no-dashboard'
})

</script>

<template>
	<div class="flex flex-col gap-4 justify-center items-center min-h-screen">
		<h1 class="text-4xl">Ej Tillåten</h1>
		<NuxtLink to="/sign-in">Logga in</NuxtLink>
	</div>
</template>