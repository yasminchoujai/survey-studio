<script>
	import Badge from '$lib/components/ui/Badge.svelte';

	let { status } = $props();

	const variant =
		status === 'Published'
			? 'published'
			: 'draft';
</script>

<Badge {variant}>
	{status}
</Badge>