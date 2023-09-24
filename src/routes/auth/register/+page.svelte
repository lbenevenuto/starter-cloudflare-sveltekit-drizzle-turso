<!-- routes/signup/+page.svelte -->
<script lang='ts'>
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<h1 class='text-7xl font-bold text-center'>Register</h1>

<div class='mx-auto flex max-w-4xl items-center gap-8 bg-base-200 p-10 my-4'>
	<img src='https://assets-prod.frzdb.net/img/0f6a3ab.png' alt='Register Page' />
	<div class='flex flex-1 flex-col'>

		{#if form?.message}<p class='bg-error text-xl text-center my-4'>{form?.message}</p>{/if}

		<div class='flex flex-col gap-5'>
			<form method='post' use:enhance>
				<div class='grid grid-flow-row auto-rows-max gap-2'>

					<label>
						<span>Username</span>
						<input type='text' name='username' id='username' placeholder='Username' class='input input-bordered w-full' />
					</label>

					<label>
						<span>Email</span>
						<input type='text' name='email' id='email' placeholder='Email' class='input input-bordered w-full' />
					</label>

					<label>
						<span>Password</span>
						<input type='password' name='password' id='password' placeholder='Password' class='input input-bordered w-full' />
					</label>

					<label>
						<span>Repeat Password</span>
						<input type='password' name='passwordRepeat' id='passwordRepeat' placeholder='Password Repeat' class='input input-bordered w-full' />
					</label>

					<input type='submit' class='btn btn-primary px-8 font-light capitalize w-full' value='Register' />
					<div class='text-right'>
						Have an account? <a href='/auth/login' class='btn btn-primary btn-outline px-3 font-light capitalize'>Login</a>
					</div>

				</div>
			</form>
		</div>
	</div>
</div>
