<script>
  import { ClipboardList } from "lucide-svelte";

  import StatusBadge from "./StatusBadge.svelte";
  import RowActions from "./RowActions.svelte";

  let { survey, deleteSurvey } = $props();

  function formatDate(date) {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
</script>

<tr
  class="group relative z-0 transition-colors duration-200 hover:z-50 hover:bg-violet-50/40"
>
  <td class="px-8 py-6">
    <div class="flex items-start gap-4">
      <div class="rounded-xl bg-violet-100 p-3 text-violet-600">
        <ClipboardList size={18} />
      </div>

      <div>
        <h3 class="font-semibold text-slate-900">
          {survey.title}
        </h3>

        <p class="mt-1 max-w-md text-sm text-slate-500">
          {survey.description || "No description"}
        </p>
      </div>
    </div>
  </td>

  <td class="px-6 py-6">
    <StatusBadge status={survey.status} />
  </td>

  <td class="px-23 py-6 font-medium text-slate-700">
    {survey.responses ?? 0}
  </td>

  <td class="px-10 py-6 text-slate-500">
    {formatDate(survey.updatedAt)}
  </td>

  <td class="px-8 py-6 text-right">
    <RowActions {survey} {deleteSurvey} />
  </td>
</tr>
