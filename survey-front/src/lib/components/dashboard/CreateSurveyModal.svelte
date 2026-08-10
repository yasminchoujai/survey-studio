<script>
  import Modal from "$lib/components/ui/Modal.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import Button from "$lib/components/ui/Button.svelte";
import { useToast } from '$lib/stores/toast.svelte.js';

  let { open = $bindable(false), addSurvey } = $props();

  let title = $state("");
  let description = $state("");
  let loading = $state(false);

  const toast = useToast();

  async function createSurvey() {
    if (!title.trim()) return;

    loading = true;

    try {
      await addSurvey({
        title: title.trim(),
        description: description.trim(),
      });

      title = "";
      description = "";
      open = false;

      toast.success("Survey created successfully");
    } catch (error) {
      console.error("Failed to create survey:", error);

      toast.error("Failed to create survey");
    } finally {
      loading = false;
    }
  }
  function close() {
    title = "";
    description = "";
    open = false;
  }
</script>

<Modal {open}>
  <div class="space-y-4">
    <div>
      <h2 class="text-xl font-semibold text-[#3B1E54]">Create Survey</h2>

      <p class="mt-1 text-sm text-slate-500">
        Give your survey a title and an optional description.
      </p>
    </div>

    <div class="space-y-2">
      <label for="title" class="text-sm font-medium text-slate-700">
        Survey Title
      </label>

      <Input
        id="title"
        bind:value={title}
        placeholder="Customer Satisfaction Survey"
      />
    </div>

    <div class="space-y-2">
      <label for="description" class="text-sm font-medium text-slate-700">
        Description
      </label>

      <textarea
        id="description"
        bind:value={description}
        rows="4"
        placeholder="Briefly describe the purpose of this survey..."
        class="w-full resize-none rounded-xl border border-[#D4BEE4] bg-white px-4 py-3 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#9B7EBD] focus:ring-2 focus:ring-[#D4BEE4]/40"
      ></textarea>
    </div>

    <div class="flex justify-end gap-3 pt-2">
      <Button
        variant="outline"
        class="min-w-[110px]"
        onclick={close}
        disabled={loading}
      >
        Cancel
      </Button>

      <Button
        class="min-w-[140px]"
        onclick={createSurvey}
        disabled={loading || !title.trim()}
      >
        {#if loading}
          Creating...
        {:else}
          Create Survey
        {/if}
      </Button>
    </div>
  </div>
</Modal>
