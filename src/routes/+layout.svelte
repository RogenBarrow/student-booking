<script>
	import { onDestroy } from 'svelte';
	import favicon from '$lib/assets/favicon.svg';
	import { supabase } from '$lib/supabaseClient';

	const { data, children } = $props();
	let session = $state(data.session);

	const { data: authListener } = supabase.auth.onAuthStateChange(
		(_event, newSession) => {
			session = newSession;
		}
	);

	onDestroy(() => {
		authListener.subscription.unsubscribe();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
