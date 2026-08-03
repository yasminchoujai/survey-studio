<script>
  import { goto } from "$app/navigation";
  import { Pencil, Trash2, Eye, BarChart3, Copy, Check } from "lucide-svelte";
  import ConfirmModal from "$lib/components/ui/ConfirmModal.svelte";

  let copied = $state(false);

  let { survey, deleteSurvey } = $props();

  let showDeleteModal = $state(false);
  let deleting = $state(false);

  function edit() {
    goto(`/surveys/${survey.id}/builder`);
  }

  function preview() {
    goto(`/surveys/${survey.id}`);
  }

  function responses() {
    goto(`/surveys/${survey.id}/responses`);
  }

  function remove() {
    showDeleteModal = true;
  }

  function cancelDelete() {
    showDeleteModal = false;
  }

  async function confirmDelete() {
    try {
      deleting = true;
      await deleteSurvey(survey.id);
      showDeleteModal = false;
    } finally {
      deleting = false;
    }
  }

  async function copyLink() {
    const url = `${window.location.origin}/public/${survey.id}`;

    try {
      await navigator.clipboard.writeText(url);

      copied = true;

      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }
</script>

<div class="flex items-center justify-end gap-1">
  {#if survey.status === "Published"}
    <button
      onclick={copyLink}
      class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-violet-100 hover:text-violet-600"
      title={copied ? "Copied!" : "Copy survey link"}
    >
      {#if copied}
        <Check size={18} class="text-green-600" />
      {:else}
        <Copy size={18} />
      {/if}
    </button>
  {/if}
  <button
    onclick={edit}
    class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-violet-100 hover:text-violet-600"
    title="Edit"
  >
    <Pencil size={18} />
  </button>

  <button
    onclick={preview}
    class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-sky-100 hover:text-sky-600"
    title="Preview"
  >
    <Eye size={18} />
  </button>

  <button
    onclick={responses}
    class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-emerald-100 hover:text-emerald-600"
    title="Responses"
  >
    <BarChart3 size={18} />
  </button>

  <div class="mx-1 h-5 w-px bg-slate-200"></div>

  <button
    onclick={remove}
    class="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-100 hover:text-red-600"
    title="Delete"
  >
    <Trash2 size={18} />
  </button>

  <ConfirmModal
    open={showDeleteModal}
    title="Delete Survey"
    message={`Are you sure you want to delete "${survey.title}"?.`}
    confirmText="Delete"
    cancelText="Cancel"
    loading={deleting}
    onConfirm={confirmDelete}
    onCancel={cancelDelete}
  />
</div>
