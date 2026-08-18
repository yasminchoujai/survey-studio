<script>
	import { goto } from '$app/navigation';

	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	import { useAuth } from '$lib/stores/auth.svelte.js';

	const auth = useAuth();

	let email = $state('');
	let password = $state('');

	async function handleLogin() {
		if (!email.trim() || !password) {
			return;
		}

		const success = await auth.login(
			email.trim(),
			password
		);

		if (success) {
			await goto('/dashboard');
		}
	}
</script>

<svelte:head>
	<title>Sign in | Survey Studio</title>

	<meta
		name="description"
		content="Sign in to your Survey Studio account."
	/>
</svelte:head>

<div
	class="flex min-h-screen items-center justify-center bg-[#FAFAFC] px-4 py-10"
>
	<div class="w-full max-w-md">

		<!-- Login Card -->

		<div
			class="rounded-2xl border border-[#EBE4F4] bg-white shadow-[0_18px_50px_rgba(59,30,84,0.08)]"
		>
			<div class="px-8 py-8 sm:px-9">

				<!-- Logo -->

				<div class="flex flex-col items-center">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4BEE4]"
					>
						<span
							class="text-sm font-bold text-[#3B1E54]"
						>
							S
						</span>
					</div>

					<p
						class="mt-2 text-xs font-semibold tracking-tight text-[#3B1E54]"
					>
						Survey Studio
					</p>
				</div>

				<!-- Heading -->

				<div class="mt-7 text-center">
					<h3
						class="text-xl font-semibold tracking-tight text-[#3B1E54]"
					>
						Sign in to your account
					</h3>

					<p class="mt-2 text-sm text-[#64748B]">
						Welcome back. Enter your details to continue.
					</p>
				</div>

				<!-- Form -->

				<form
					class="mt-7 space-y-5"
					onsubmit={(event) => {
						event.preventDefault();
						handleLogin();
					}}
				>
					<!-- Email -->

					<div>
						<label
							for="email"
							class="block text-sm font-medium text-[#3B1E54]"
						>
							Email address
						</label>

						<div class="mt-2">
							<Input
								id="email"
								type="email"
								name="email"
								autocomplete="email"
								placeholder="admin@surveystudio.com"
								bind:value={email}
								disabled={auth.loading}
								required
							/>
						</div>
					</div>

					<!-- Password -->

					<div>
						<div class="flex items-center justify-between">
							<label
								for="password"
								class="block text-sm font-medium text-[#3B1E54]"
							>
								Password
							</label>

							<button
								type="button"
								class="text-xs font-medium text-[#9B7EBD] transition-colors hover:text-[#3B1E54]"
							>
								Forgot password?
							</button>
						</div>

						<div class="mt-2">
							<Input
								id="password"
								type="password"
								name="password"
								autocomplete="current-password"
								placeholder="Enter your password"
								bind:value={password}
								disabled={auth.loading}
								required
							/>
						</div>
					</div>

					<!-- Error -->

					{#if auth.error}
						<div
							class="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
							role="alert"
						>
							<div
								class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100"
							>
								<svg
									viewBox="0 0 20 20"
									fill="currentColor"
									class="h-4 w-4 text-red-600"
									aria-hidden="true"
								>
									<path
										fill-rule="evenodd"
										d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 1 1.06 0L10 7.94l.66-.72a.75.75 0 1 1 1.08 1.04L11.02 9l.72.72a.75.75 0 1 1-1.08 1.04L10 10.06l-.66.7a.75.75 0 1 1-1.08-1.04L8.98 9l-.7-.72a.75.75 0 0 1 0-1.06Z"
										clip-rule="evenodd"
									/>
								</svg>
							</div>

							<p class="text-sm font-medium text-red-600">
								{auth.error}
							</p>
						</div>
					{/if}

					<!-- Submit -->

					<Button
						type="submit"
						variant="primary"
						size="lg"
						disabled={
							auth.loading ||
							!email.trim() ||
							!password
						}
						class="w-full !h-11 !rounded-xl"
					>
						{#if auth.loading}
							<span
								class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
							></span>

							<span>Signing in...</span>
						{:else}
							<span>Sign in</span>
						{/if}
					</Button>
				</form>

				<!-- Footer -->

				<div class="mt-7 flex items-center gap-3">
					<div class="h-px flex-1 bg-[#EBE4F4]"></div>

					<span
						class="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]"
					>
						Survey Studio
					</span>

					<div class="h-px flex-1 bg-[#EBE4F4]"></div>
				</div>

				<p
					class="mt-4 text-center text-xs text-[#64748B]"
				>
					Your workspace is secure and protected.
				</p>
			</div>
		</div>

		<!-- Copyright -->

		<p
			class="mt-5 text-center text-[11px] text-[#94A3B8]"
		>
			© {new Date().getFullYear()} Survey Studio
		</p>
	</div>
</div>