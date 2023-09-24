<script lang='ts'>
	import '../app.css';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	$: user = data.user;

	const year = new Date().getFullYear();
</script>

<div class='app' data-sveltekit-preload-data='off'>

	<div class='navbar bg-base-300'>
		<div class='flex-1'>
			<a href='/' class='btn btn-ghost normal-case text-xl'>Your Company</a>
		</div>
		<div class='flex-none'>
			<ul class='menu menu-horizontal px-1'>
				<li><a href='/'>Home</a></li>
				<li><a href='/about'>About</a></li>
				<li><a href='/users'>Users</a></li>
				{#if user}
					<li><a href='/profile'>{user.username}</a></li>
					<li>
						<form method='post' action='/profile/?/logout' use:enhance>
							<input type='submit' value='Sign out' />
						</form>
					</li>
				{:else}
					<li><a href='/auth/login'>Login</a></li>
				{/if}
			</ul>
		</div>
	</div>

	<main>
		<div class='container mx-auto'>
			<div class='my-4 flex h-24 items-center justify-center border bg-base-200'>
				<h2>ADS GO HERE</h2>
			</div>
			<slot />
		</div>
	</main>

	<footer class='footer footer-center p-4 bg-base-300 text-base-content'>
		<div>
			<p>Copyright © {year} - All right reserved by You Company</p>
		</div>
	</footer>

</div>