<script>
  import { onMount } from "svelte";
  import { page } from "$app/state";
  import { CheckCircle2, AlertTriangle } from "lucide-svelte";

  import { getPublicSurvey } from "$lib/api/public.js";
  import { submitResponse } from "$lib/api/responses.js";

  import Card from "$lib/components/ui/Card.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Spinner from "$lib/components/ui/Spinner.svelte";
  import State from "$lib/components/ui/State.svelte";

  import QuestionField from "$lib/components/public/QuestionField.svelte";

  let survey = $state(null);
  let answers = $state({});
  let errors = $state({});

  let loading = $state(true);
  let loadError = $state("");

  let submitting = $state(false);
  let submitted = $state(false);

  onMount(async () => {
    try {
      survey = await getPublicSurvey(page.params.id);

      const initial = {};

      for (const section of survey.sections) {
        for (const question of section.questions) {
          if (question.type === "multiple_choice") {
            initial[question.id] = [];
          } else if (question.type === "rating") {
            initial[question.id] = 0;
          } else {
            initial[question.id] = "";
          }
        }
      }

      answers = initial;
    } catch (err) {
      loadError = err.message || "This survey could not be found";
    } finally {
      loading = false;
    }
  });

  function validate() {
    errors = {};

    for (const section of survey.sections) {
      for (const question of section.questions) {
        if (!question.required) continue;

        const value = answers[question.id];

        const empty =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        if (empty) {
          errors[question.id] = "This question is required";
        }
      }
    }

    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    submitting = true;

    try {
      const payload = Object.entries(answers).map(([questionId, value]) => ({
        questionId,
        value,
      }));

      await submitResponse(survey.id, payload);

      submitted = true;
    } catch (err) {
      loadError = err.message || "Failed to submit your response";
    } finally {
      submitting = false;
    }
  }
</script>

{#if loading}
  <div class="flex h-screen items-center justify-center bg-slate-50">
    <Spinner />
  </div>
{:else if loadError && !survey}
  <div class="flex h-screen items-center justify-center bg-slate-50">
    <State
      icon={AlertTriangle}
      title="Survey unavailable"
      description={loadError}
    />
  </div>
{:else if submitted}
  <div class="flex h-screen items-center justify-center bg-slate-50">
    <State
      icon={CheckCircle2}
      title="Thanks for your response!"
      description="Your answers have been submitted successfully."
    />
  </div>
{:else if survey}
  <div class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-2xl space-y-6">
      <Card>
        <h1 class="text-2xl font-bold text-slate-900">
          {survey.title}
        </h1>

        {#if survey.description}
          <p class="mt-2 text-slate-500">
            {survey.description}
          </p>
        {/if}
      </Card>

      {#each survey.sections as section}
        {#if section.questions.length}
          <Card class="space-y-6">
            <h2
              class="text-sm font-semibold uppercase tracking-wide text-slate-400"
            >
              {section.title}
            </h2>

            {#each section.questions as question}
              <QuestionField
                {question}
                bind:value={answers[question.id]}
                error={errors[question.id]}
              />
            {/each}
          </Card>
        {/if}
      {/each}

      {#if loadError}
        <p class="text-sm text-red-500">{loadError}</p>
      {/if}

      <Button
        class="w-full"
        size="lg"
        disabled={submitting}
        onclick={handleSubmit}
      >
        {submitting ? "Submitting..." : "Submit"}
      </Button>
    </div>
  </div>
{/if}
