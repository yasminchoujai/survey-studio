<script>
	import { page } from '$app/state';
	import SidebarItem from './SidebarItem.svelte';

	import {
		LayoutDashboard,
		Settings
	} from 'lucide-svelte';
</script>

<aside class="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">

	<!-- Logo -->

	<div class="border-b border-slate-200 px-6 py-5">

		<div class="flex items-center gap-3">

			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4BEE4]">

				<span class="text-sm font-semibold text-[#3B1E54]">
					S
				</span>

			</div>

			<h1 class="text-[15px] font-semibold tracking-tight text-slate-800">
				Survey Studio
			</h1>

		</div>

	</div>

	<!-- Navigation -->

	<nav class="flex-1 px-4 py-6">

		<p class="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
			Workspace
		</p>

		<div class="space-y-1">

			<SidebarItem
				icon={LayoutDashboard}
				label="Dashboard"
				href="/"
				active={page.url.pathname === '/'}
			/>

			<SidebarItem
				icon={Settings}
				label="Settings"
				href="/settings"
				active={page.url.pathname === '/settings'}
			/>

		</div>

	</nav>

	<!-- Footer -->

	<div class="border-t border-slate-200 px-6 py-5">

		<p class="text-xs text-slate-400">
			Survey Studio v1.0
		</p>

	</div>

</aside>