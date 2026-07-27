<script>
	import { page } from '$app/state';
	import SidebarItem from './SidebarItem.svelte';

	import {
		LayoutDashboard,
		ClipboardList
	} from 'lucide-svelte';
</script>

<aside class="flex h-screen w-64 flex-col border-r border-[#E8E2F2] bg-white">

	<!-- Logo -->
	<div class="border-b border-[#E8E2F2] px-6 py-7">

		<div class="flex items-center gap-3">

			<div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4BEE4] text-[#3B1E54] shadow-sm">
				<span class="text-lg font-bold">S</span>
			</div>

			<div>
				<h1 class="text-xl font-semibold text-[#3B1E54]">
					Survey Studio
				</h1>

				<p class="text-sm text-slate-500">
					MVP
				</p>
			</div>

		</div>

	</div>

	<nav class="flex-1 px-4 py-6">

		<p class="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
			Workspace
		</p>

		<div class="space-y-2">

			<SidebarItem
				icon={LayoutDashboard}
				label="Dashboard"
				href="/dashboard"
				active={page.url.pathname === '/dashboard'}
			/>

			<SidebarItem
				icon={ClipboardList}
				label="Surveys"
				href="/dashboard"
				active={page.url.pathname === '/dashboard'}
			/>

		</div>

	</nav>

	<div class="border-t border-[#E8E2F2] p-5">

		<div class="rounded-2xl border border-[#E8E2F2] bg-[#F8F5FC] p-4">

			<p class="font-medium text-[#3B1E54]">
				Survey Studio
			</p>

			<p class="mt-1 text-xs leading-5 text-slate-500">
				Create, publish and manage surveys from one place.
			</p>

		</div>

	</div>

</aside>