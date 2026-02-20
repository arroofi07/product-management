<script lang="ts">
	import '../routes/layout.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import Header from '$lib/components/layout/Header.svelte';
	import { sidebarOpen } from '$lib/stores';

	let { children } = $props();
</script>

<svelte:head>
	<title>Manajemen Barang</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="flex h-screen overflow-hidden bg-background">
	<!-- Sidebar -->
	<Sidebar />

	<!-- Main content -->
	<div class="flex min-w-0 flex-1 flex-col overflow-hidden">
		<Header />
		<main class="flex-1 overflow-y-auto">
			<div class="page-enter">
				{@render children()}
			</div>
		</main>
	</div>
</div>
