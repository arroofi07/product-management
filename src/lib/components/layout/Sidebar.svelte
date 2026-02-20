<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import {
		LayoutDashboard, Package, Tags, Truck, ArrowDownToLine,
		ArrowUpFromLine, BarChart3, Settings, ChevronDown, ChevronRight,
		AlertTriangle, Menu, X
	} from 'lucide-svelte';
	import { sidebarOpen, dashboardStats } from '$lib/stores';
	import { cn } from '$lib/utils';

	type NavItem = {
		href?: string;
		label: string;
		icon: any;
		children?: { href: string; label: string }[];
		badge?: () => string | null;
	};

	const navItems: NavItem[] = [
		{ href: '/', label: 'Dashboard', icon: LayoutDashboard },
		{
			label: 'Barang',
			icon: Package,
			children: [
				{ href: '/barang', label: 'Daftar Barang' },
				{ href: '/kategori', label: 'Kategori' }
			]
		},
		{ href: '/supplier', label: 'Supplier', icon: Truck },
		{
			label: 'Transaksi',
			icon: ArrowDownToLine,
			children: [
				{ href: '/transaksi/masuk', label: 'Barang Masuk' },
				{ href: '/transaksi/keluar', label: 'Barang Keluar' }
			]
		},
		{ href: '/laporan', label: 'Laporan', icon: BarChart3 },
		{ href: '/pengaturan', label: 'Pengaturan', icon: Settings }
	];

	let openMenus = $state<Record<string, boolean>>({});
	let stats = $derived($dashboardStats);

	function toggleMenu(label: string) {
		openMenus[label] = !openMenus[label];
	}

	function isActive(href: string) {
		return $page.url.pathname === href;
	}

	function isChildActive(children: { href: string }[]) {
		return children.some((c) => $page.url.pathname.startsWith(c.href));
	}

	// Auto-open parent if child is active
	$effect(() => {
		for (const item of navItems) {
			if (item.children && isChildActive(item.children)) {
				openMenus[item.label] = true;
			}
		}
	});
</script>

<!-- Mobile overlay -->
{#if $sidebarOpen}
	<div
		class="fixed inset-0 z-30 bg-black/50 lg:hidden"
		onclick={() => ($sidebarOpen = false)}
		role="button"
		tabindex="-1"
	></div>
{/if}

<aside
	class={cn(
		'gradient-sidebar fixed top-0 left-0 bottom-0 z-40 w-64 flex flex-col transition-transform duration-300',
		$sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
		'lg:relative lg:translate-x-0 lg:z-auto'
	)}
>
	<!-- Logo -->
	<div class="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
		<div class="size-9 rounded-xl gradient-blue flex items-center justify-center shadow-lg flex-shrink-0">
			<Package class="size-5 text-white" />
		</div>
		<div>
			<p class="text-white font-bold text-sm leading-tight">ManajemenBarang</p>
			<p class="text-white/40 text-xs">Sistem Inventori</p>
		</div>
		<button
			class="ml-auto text-white/40 hover:text-white lg:hidden transition-colors"
			onclick={() => ($sidebarOpen = false)}
		>
			<X class="size-4" />
		</button>
	</div>

	<!-- Stok alert badge -->
	{#if stats.stokHabis > 0 || stats.stokMenipis > 0}
		<button
			class="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 transition-colors"
			onclick={() => goto('/barang')}
		>
			<AlertTriangle class="size-3.5 flex-shrink-0" />
			<span class="text-xs">
				{stats.stokHabis > 0 ? `${stats.stokHabis} habis` : ''}
				{stats.stokHabis > 0 && stats.stokMenipis > 0 ? ', ' : ''}
				{stats.stokMenipis > 0 ? `${stats.stokMenipis} menipis` : ''}
			</span>
		</button>
	{/if}

	<!-- Navigation -->
	<nav class="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
		{#each navItems as item}
			{#if item.children}
				<!-- Parent with children -->
				<div>
					<button
						class={cn(
							'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
							isChildActive(item.children)
								? 'bg-white/10 text-white'
								: 'text-white/60 hover:text-white hover:bg-white/8'
						)}
						onclick={() => toggleMenu(item.label)}
					>
						<item.icon class="size-4.5 flex-shrink-0" />
						<span class="flex-1 text-left">{item.label}</span>
						{#if openMenus[item.label]}
							<ChevronDown class="size-3.5 text-white/40" />
						{:else}
							<ChevronRight class="size-3.5 text-white/40" />
						{/if}
					</button>

					{#if openMenus[item.label]}
						<div class="ml-4 mt-0.5 space-y-0.5">
							{#each item.children as child}
								<a
									href={child.href}
									class={cn(
										'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200',
										isActive(child.href)
											? 'bg-white/15 text-white font-medium'
											: 'text-white/50 hover:text-white hover:bg-white/8'
									)}
								>
									<span class="size-1 rounded-full bg-current opacity-60"></span>
									{child.label}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{:else}
				<!-- Simple link -->
				<a
					href={item.href}
					class={cn(
						'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
						isActive(item.href ?? '')
							? 'bg-blue-500/20 text-white border border-blue-500/30'
							: 'text-white/60 hover:text-white hover:bg-white/8'
					)}
				>
					<item.icon class="size-4.5 flex-shrink-0" />
					{item.label}
				</a>
			{/if}
		{/each}
	</nav>

	<!-- Footer -->
	<div class="px-4 py-4 border-t border-sidebar-border">
		<div class="flex items-center gap-3">
			<div class="size-8 rounded-full gradient-teal flex items-center justify-center text-white text-xs font-bold">
				AD
			</div>
			<div>
				<p class="text-white text-xs font-medium">Admin</p>
				<p class="text-white/40 text-xs">Administrator</p>
			</div>
		</div>
	</div>
</aside>
