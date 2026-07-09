<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const baseItems: NavigationMenuItem[] = [
	{
		label: 'Dashboard',
		icon: 'i-lucide-house',
		to: '/dashboard'
	},
	{
		label: 'Requests',
		icon: 'i-lucide-package-plus',
		to: '/requests',
	},
	{
		label: 'Prints',
		icon: 'i-lucide-images',
		to: '/prints',
	}
]

const menuItems = computed(() => {
	const items = [...baseItems]

	/* 	if(currentUser.value?.role === 'admin') {
		items.push({
			label: 'Admin',
			icon: 'i-lucide-shield-user',
			to: '/admin',
		})
	} */
	return items
})

</script>

<template>
	<UDashboardGroup>
		<UDashboardSidebar
			collapsible
			resizable
			:ui="{
				footer: 'border-t border-default flex-row',
				header: 'justify-between',
			}"
			:default-size="20"
			:min-size="20"
			:max-size="24"
		>
			<template #header="{ collapsed }">
				<h1 v-if="!collapsed">Hampus 3D Prints</h1>
				<UDashboardSidebarCollapse />
			</template>

			<template #default="{ collapsed }">
				<UNavigationMenu
					:collapsed="collapsed"
					:items="menuItems"
					highlight
					orientation="vertical"/>
			</template>

			<template #footer="{ collapsed }">
				<ClientOnly>
					<!-- 					<div v-if="!isLoaded" class="flex gap-2">
						<USkeleton class="size-7 rounded-full" />
						<h1>Loading...</h1>
					</div>
					<div v-if="isLoaded && user" class="flex gap-2">
						<UserButton>
							<UserButton.MenuItems>
								<UserButton.Action label="Profile" @click="router.push(`/profile/${user?.id}`)">
									<template #labelIcon>
										<UIcon name="i-lucide-user" :size="16" />
									</template>
								</UserButton.Action>
								<UserButton.Action v-if="isAdmin" label="Admin" @click="router.push('/admin')">
									<template #labelIcon>
										<UIcon name="i-lucide-shield-user" :size="16" />
									</template>
								</UserButton.Action>
							</UserButton.MenuItems>
						</UserButton>
						<h1 v-if="!collapsed">{{ user.username ?? user.fullName }}</h1>
					</div> -->
					<h1>Name</h1>
				</ClientOnly>
			</template>
		</UDashboardSidebar>
		<UDashboardPanel class="p-6 overflow-y-scroll">
			<slot />
		</UDashboardPanel>
	</UDashboardGroup>
</template>
