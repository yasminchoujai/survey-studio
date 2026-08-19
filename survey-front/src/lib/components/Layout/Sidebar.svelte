<script>
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	import {
		LayoutDashboard,
		BarChart3,
		LogOut
	} from 'lucide-svelte';

	import SidebarItem from './SidebarItem.svelte';

	import { useAuth } from '$lib/stores/auth.svelte.js';

	const auth = useAuth();

	async function handleLogout() {
		auth.logout();
		await goto('/login');
	}
</script>

<aside
	class="flex h-screen w-64 shrink-0 flex-col border-r border-[#EBE4F4] bg-white"
>
	<!-- Logo -->
	<div class="border-b border-[#EBE4F4] px-4 py-8">
		<div class="flex flex-col items-center gap-2">
			<div
				class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D4BEE4]"
			>
				<span
					class="text-sm font-bold text-[#3B1E54]"
				>
					S
				</span>
			</div>

			<p
				class="text-[11px] font-semibold tracking-tight text-[#3B1E54]"
			>
				Survey Studio
			</p>
		</div>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 px-4 py-6">
		<p
			class="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400"
		>
			Workspace
		</p>

		<div class="space-y-1">
			<SidebarItem
				icon={LayoutDashboard}
				label="Dashboard"
				href="/dashboard"
				active={page.url.pathname === '/dashboard'}
			/>

			<SidebarItem
				icon={BarChart3}
				label="Statistics"
				href="/statistics"
				active={page.url.pathname === '/statistics'}
			/>
		</div>
	</nav>

	<!-- Logout -->
	<div class="border-t border-[#EBE4F4] p-4">
		<button
			type="button"
			onclick={handleLogout}
			class="group flex h-11 w-full items-center justify-between rounded-xl border border-transparent px-3 text-sm font-medium text-slate-500 transition-all duration-200 hover:border-[#D4BEE4] hover:bg-[#D4BEE4]/25 hover:text-[#3B1E54]"
		>
			<div class="flex items-center gap-3">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4BEE4]/40 transition-colors duration-200 group-hover:bg-[#D4BEE4]/70"
				>
					<LogOut
						class="h-4 w-4 text-[#9B7EBD] transition-colors duration-200 group-hover:text-[#3B1E54]"
					/>
				</div>

				<span>Log out</span>
			</div>

			<span
				class="text-xs text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#9B7EBD]"
			>
				→
			</span>
		</button>
	</div>
</aside>