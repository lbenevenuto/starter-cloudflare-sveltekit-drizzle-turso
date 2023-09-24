<script lang='ts'>
	import { enhance } from '$app/forms';

	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1 class='text-7xl font-bold text-center'>Reset password</h1>

<div class='mx-auto max-w-lg bg-base-200 p-10 my-4'>
	<form method='post' use:enhance>
		<div class='grid grid-flow-row auto-rows-max gap-2'>
			<label>
				<span>Email</span>
				<input type='text' name='email' id='email' placeholder='Email' class='input input-bordered w-full' />
			</label>

			<input type='submit' class='btn btn-primary px-8 font-light capitalize w-full' value='Reset' />
			<div class='text-right'>
				<a href='/auth/login' class='btn btn-primary btn-outline px-3 font-light capitalize'>Login</a>
			</div>

		</div>
	</form>
	{#if form?.message}
		<div class='mt-4'>
			<p class='bg-error text-center'>{form.message}</p>
		</div>
	{/if}
	{#if form?.success}
		<div class='mt-4'>
			<p class='bg-success text-center'>Your password reset link was sent to your inbox</p>
		</div>
	{/if}
</div>