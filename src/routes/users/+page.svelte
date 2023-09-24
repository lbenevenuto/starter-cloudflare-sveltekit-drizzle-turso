<script lang='ts'>
	import type { PageData } from './$types';

	export let data: PageData;

	$: users = data.users;
</script>

<h1 class='text-7xl font-bold text-center'>Users</h1>

<div class='card bg-base-200 shadow-xl m-4'>
	<div class='card-body'>
		<div class='overflow-x-auto'>
			<table class='table table-zebra'>
				<!-- head -->
				<thead>
				<tr>
					<th>#</th>
					<th>Username</th>
					<th>Email</th>
					<th>Email Verified</th>
					<th>Providers</th>
					<th>Created At</th>
				</tr>
				</thead>
				<tbody>
				<!-- body -->
				{#each users as user, i}
					<tr>
						<td>{i + 1}</td>
						<td>{user.username}</td>
						<td>{user.email}</td>
						<td><input type='checkbox' checked='{user.emailVerified}' class='checkbox checkbox-primary' disabled /></td>
						<td>
							{#each user.providers as provider}
								<div class='badge badge-primary badge-outline'>{provider.id}</div>
							{/each}
						</td>
						<td>{user.createdAt?.toLocaleString()}</td>
					</tr>
				{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>