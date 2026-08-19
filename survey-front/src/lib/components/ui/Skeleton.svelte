<script>
	let {
		class: className = '',
		width = '',
		height = ''
	} = $props();
</script>

<div
	class={`animate-pulse rounded-lg bg-slate-200 ${className}`}
	style={`${width ? `width: ${width};` : ''}${height ? `height: ${height};` : ''}`}
></div>