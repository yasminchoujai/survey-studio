<script>
  import { goto } from "$app/navigation";
  import { ArrowLeft, Eye, Send } from "lucide-svelte";

  import Button from "$lib/components/ui/Button.svelte";

  let { survey, onPublish = () => {}, publishing = false } = $props();

  let isPublished = $derived(survey.status === "Published");

  function back() {
    goto("/dashboard");
  }

  function preview() {
    goto(`/surveys/${survey.id}/preview`, {
      state: { survey: $state.snapshot(survey) },
    });
  }
</script>

<header
  class="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5"
>
  <!-- Left -->

  <div class="flex min-w-0 items-center gap-3">
    <Button variant="ghost" size="icon" onclick={back}>
      <ArrowLeft size={18} />
    </Button>

    <div class="flex min-w-0 items-center gap-3">
      <h1 class="truncate text-sm font-medium text-slate-800">
        {survey.title}
      </h1>

      <div
        class="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

        {survey.status}
      </div>

      <span class="hidden text-xs text-slate-500 sm:block">
        • {survey.sections.length}
        section{survey.sections.length !== 1 ? "s" : ""}
      </span>
    </div>
  </div>

  <!-- Actions -->

  <div class="flex items-center gap-2">
    <Button variant="outline" onclick={preview}>
      <Eye size={16} />
      Preview
    </Button>

    <Button onclick={onPublish} disabled={publishing}>
      <Send size={16} />
      {#if publishing}
        {isPublished ? "Updating..." : "Publishing..."}
      {:else}
        {isPublished ? "Update" : "Publish"}
      {/if}
    </Button>
  </div>
</header>
