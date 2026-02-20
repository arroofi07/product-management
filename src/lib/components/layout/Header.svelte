<script lang="ts">
	import { page } from '$app/stores';
	import { Bell, Menu, Moon, Sun, Search } from 'lucide-svelte';
	import { sidebarOpen, darkMode, dashboardStats } from '$lib/stores';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { goto } from '$app/navigation';

	const routeLabels: Record<string, string> = {
		'/': 'Dashboard',
		'/barang': 'Daftar Barang',
		'/kategori': 'Kategori',
		'/supplier': 'Supplier',
		'/transaksi/masuk': 'Barang Masuk',
		'/transaksi/keluar': 'Barang Keluar',
		'/laporan': 'Laporan',
		'/pengaturan': 'Pengaturan'
	};

	let stats = $derived($dashboardStats);
	let currentLabel = $derived(routeLabels[$page.url.pathname] ?? 'Halaman');
	let totalAlert = $derived(stats.stokHabis + stats.stokMenipis);

	function toggleDark() {
		$darkMode = !$darkMode;
		if ($darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}
</script>

<header class="sticky top-0 z-20 h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center gap-4 px-4 lg:px-6">
	<!-- Hamburger (mobile) -->
	<button
		class="lg:hidden size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
		onclick={() => ($sidebarOpen = !$sidebarOpen)}
	>
		<Menu class="size-5" />
	</button>

	<!-- Page title -->
	<div class="flex items-center gap-2">
		<h1 class="text-base font-semibold text-foreground">{currentLabel}</h1>
	</div>

	<div class="flex items-center gap-2 ml-auto">
		<!-- Dark mode -->
		<button
			class="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
			onclick={toggleDark}
			aria-label="Toggle dark mode"
		>
			{#if $darkMode}
				<Sun class="size-4.5" />
			{:else}
				<Moon class="size-4.5" />
			{/if}
		</button>

		<!-- Notifications -->
		<button
			class="relative size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
			onclick={() => goto('/barang')}
			aria-label="Notifikasi stok"
		>
			<Bell class="size-4.5" />
			{#if totalAlert > 0}
				<span class="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background"></span>
			{/if}
		</button>

		<!-- User menu -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button class="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent transition-colors">
					<div class="size-8 rounded-full gradient-teal flex items-center justify-center text-white text-xs font-bold">
						AD
					</div>
					<div class="hidden sm:block text-left">
						<p class="text-sm font-medium text-foreground leading-tight">Admin</p>
						<p class="text-xs text-muted-foreground leading-tight">Administrator</p>
					</div>
				</button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-44">
				<DropdownMenu.Item onclick={() => goto('/pengaturan')}>Pengaturan</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="text-destructive">Keluar</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
