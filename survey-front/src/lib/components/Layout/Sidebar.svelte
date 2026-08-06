<script>
  import { page } from "$app/state";
  import SidebarItem from "./SidebarItem.svelte";

  import { LayoutDashboard, BarChart3 } from "lucide-svelte";
</script>

<aside class="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
<!-- Logo -->

<div class="border-b border-slate-200 px-4 py-10">

	<div class="flex flex-col items-center gap-1">

		<div
			class="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D4BEE4]"
		>
			<span class="text-xs font-bold text-[#3B1E54]">
				S
			</span>
		</div>


		<p class="text-[10px] font-semibold tracking-tight text-[#3B1E54]">
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
        active={page.url.pathname === "/dashboard"}
      />

      <SidebarItem
        icon={BarChart3}
        label="Statistics"
        href="/statistics"
        active={page.url.pathname === "/statistics"}
      />
    </div>
  </nav>

  <!-- Footer -->

  <div class="border-t border-slate-200 px-6 py-5">
    <p class="text-xs text-slate-400">Survey Studio v1.0</p>
  </div>
</aside>
