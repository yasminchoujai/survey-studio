<script>
	import { page } from '$app/state';
	import SidebarItem from './SidebarItem.svelte';
	import { LayoutDashboard } from 'lucide-svelte';
</script>

<aside class="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

	<div class="border-b border-slate-200 px-6 py-6">

		<h1 class="text-xl font-semibold tracking-tight text-slate-900">
			Survey Studio
		</h1>

		<p class="mt-1 text-sm text-slate-500">
			MVP
		</p>

	</div>

	<nav class="flex-1 p-3">

		<SidebarItem
			icon={LayoutDashboard}
			label="Dashboard"
			href="/"
			active={page.url.pathname === '/'}
		/>

	</nav>

</aside>