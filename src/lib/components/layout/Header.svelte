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

<header class="sticky top-0 z-20 h-16 border-b border-border/50 bg-background/95 backdrop-blur-md flex items-center gap-4 px-4 lg:px-6 shadow-sm">
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
				<Sun class="size-4.5 transition-transform duration-300 hover:rotate-90" />
			{:else}
				<Moon class="size-4.5 transition-transform duration-300 hover:rotate-12" />
			{/if}
		</button>

		<!-- Notifications -->
		<button
			class="relative size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
			onclick={() => goto('/barang')}
			aria-label="Notifikasi stok"
		>
			<Bell class="size-4.5 transition-transform duration-300 hover:scale-110" />
			{#if totalAlert > 0}
				<span class="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500 ring-2 ring-background animate-pulse"></span>
			{/if}
		</button>

		<!-- User menu -->
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<button class="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-accent hover:shadow-sm transition-all duration-200 border border-transparent hover:border-border">
					<div class="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold ring-1 ring-primary/20">
						AD
					</div>
					<div class="hidden sm:block text-left">
						<p class="text-sm font-semibold text-foreground leading-tight">Admin</p>
						<p class="text-xs text-muted-foreground leading-tight font-medium">Administrator</p>
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
