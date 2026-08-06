<script>
  import { goto } from "$app/navigation";
  import { ArrowLeft, Eye, Pencil } from "lucide-svelte";

  import Button from "$lib/components/ui/Button.svelte";
  import StatusBadge from "$lib/components/dashboard/StatusBadge.svelte";

  let { survey } = $props();

  function back() {
    goto("/dashboard");
  }

  function edit() {
    goto(`/surveys/${survey.id}/builder`);
  }

  function preview() {
    goto(`/surveys/${survey.id}/preview`);
  }


</script>

<header
  class="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-5"
>
  <div class="flex min-w-0 items-center gap-3">
    <Button variant="ghost" size="icon" onclick={back}>
      <ArrowLeft size={18} />
    </Button>

    <div class="flex min-w-0 items-center gap-3">
      <h1 class="truncate text-sm font-medium text-slate-800">
        {survey.title}
      </h1>

      <StatusBadge status={survey.status} />

      <span class="hidden text-xs text-slate-500 sm:block">
        • {survey.responses ?? 0}
        response{survey.responses === 1 ? "" : "s"}
      </span>
    </div>
  </div>

  <div class="flex items-center gap-2">
    <Button variant="outline" onclick={preview}>
      <Eye size={16} />
      Preview
    </Button>

    <Button variant="outline" onclick={edit}>
      <Pencil size={16} />
      Edit
    </Button>
  </div>
</header>
