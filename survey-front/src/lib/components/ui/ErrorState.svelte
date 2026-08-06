<script>
	import Button from "./Button.svelte";
	import { TriangleAlert } from "lucide-svelte";

	let {
		title = "Something went wrong",
		message = "",
		buttonText = "Retry",
		onRetry = () => {}
	} = $props();
</script>

<div class="flex justify-center py-20">

	<div
		class="w-full max-w-lg rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm"
	>

		<div
			class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500"
		>
			<TriangleAlert size={30} />
		</div>

		<h2 class="mt-6 text-xl font-semibold text-[#3B1E54]">
			{title}
		</h2>

		<p class="mt-2 text-sm leading-6 text-slate-500">
			{message}
		</p>

		<div class="mt-8">
			<Button onclick={onRetry}>
				{buttonText}
			</Button>
		</div>

	</div>

</div>