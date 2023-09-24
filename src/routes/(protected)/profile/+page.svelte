<script lang='ts'>
	import { enhance } from '$app/forms';

	import type { PageData, ActionData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	let updating = false;

	$: user = data.user;
	$: console.log(user);
	$: console.log(form);
</script>

<h1 class='text-7xl font-bold text-center'>Profile</h1>

<div class='mx-auto max-w-lg bg-base-200 p-10 m-4'>
	<div class='overflow-x-auto'>
		<table class='table'>
			<tbody>
			<tr>
				<th>User ID</th>
				<td>{user.userId}</td>
			</tr>
			<tr>
				<th>Username</th>
				<td>{user.username}</td>
			</tr>
			<tr>
				<th>Email</th>
				<td>{user.email}</td>
			</tr>
			<tr>
				<th>Email verified</th>
				<td>{user.emailVerified}
					{#if !user.emailVerified}<a href='/email-verification' class='btn btn-warning ml-2'>Email Verification</a>{/if}
				</td>
			</tr>
			</tbody>
		</table>

		<div class='divider'></div>
		<h1 class='text-3xl text-center my-4'>Update Password</h1>
		<form
			method="POST"
			action="?/changePassword"
			use:enhance={() => {
			updating = true;

			return async ({ update }) => {
				await update();
				updating = false;
			};
		}}
		>
			<div class='grid grid-flow-row auto-rows-max gap-2'>
				<label>
					<span>Old password</span>
					<input type='password' name='oldPassword' id='oldPassword' placeholder='Old password' class='input input-bordered w-full' />
				</label>

				<label>
					<span>New Password</span>
					<input type='password' name='newPassword' id='newPassword' placeholder='New password' class='input input-bordered w-full' />
				</label>

				<input type='submit' class='btn btn-primary px-8 font-light capitalize w-full' value='Change' disabled={updating} />
			</div>
		</form>

		{#if form?.success}<p class='bg-success text-xl text-center my-4'>{form?.message}</p>{/if}

		{#if !form?.success && form?.message}<p class='bg-error text-xl text-center my-4'>{form?.message}</p>{/if}
	</div>
</div>
