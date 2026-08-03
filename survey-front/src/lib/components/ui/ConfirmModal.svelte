<script>
  let {
    open = false,
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    onConfirm = () => {},
    onCancel = () => {},
  } = $props();

  function close() {
    if (loading) return;
    onCancel();
  }
</script>

{#if open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Backdrop -->
    <button
      type="button"
      class="absolute inset-0 bg-black/50"
      aria-label="Close confirmation dialog"
      onclick={close}
      disabled={loading}
    ></button>

    <!-- Modal -->
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      class="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-2xl"
    >
      <!-- Header -->
      <div class="border-b border-slate-200 px-6 py-4 text-center">
        <h2
          id="confirm-modal-title"
          class="text-xl font-semibold text-slate-900"
        >
          {title}
        </h2>
      </div>

      <!-- Body -->
      <div class="px-6 py-5 text-center">
        <p class="text-sm leading-6 text-slate-600">
          {message}
        </p>
      </div>

      <!-- Footer -->
      <div class="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          onclick={close}
          disabled={loading}
        >
          {cancelText}
        </button>

        <button
          type="button"
          class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          onclick={onConfirm}
          disabled={loading}
        >
          {#if loading}
            Deleting...
          {:else}
            {confirmText}
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}
