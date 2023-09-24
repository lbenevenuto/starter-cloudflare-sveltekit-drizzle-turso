<script lang='ts'>
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1 class='text-7xl font-bold text-center'>Email Verification</h1>

<div class='mx-auto max-w-lg bg-base-200 p-10 m-4'>
	<p>Your email verification link was sent to your inbox.</p>
	<div class='pt-4'>
		<form method='post' use:enhance>
			<input type='submit' value='Resend verification link' class='btn btn-primary'>
		</form>
		{#if form?.success}
			<p class='text-info pt-4'>Your verification link was resent</p>
		{/if}
	</div>
</div>