<script lang="ts">
	import {
		Package,
		Boxes,
		TrendingUp,
		ShoppingCart,
		AlertTriangle,
		ArrowUpRight,
		ArrowDownRight,
		Eye
	} from 'lucide-svelte';
	import StatsCard from '$lib/components/ui/StatsCard.svelte';
	import {
		dashboardStats,
		barangWithRelations,
		transaksiMasukStore,
		transaksiKeluarStore,
		kategoriStore,
		supplierStore
	} from '$lib/stores';
	import { formatRupiah, formatDateShort, formatNumber } from '$lib/utils/helpers';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Progress } from '$lib/components/ui/progress';

	let stats = $derived($dashboardStats);
	let barangList = $derived($barangWithRelations);
	let transaksiMasuk = $derived($transaksiMasukStore);
	let transaksiKeluar = $derived($transaksiKeluarStore);
	let kategoriList = $derived($kategoriStore);
	let supplierList = $derived($supplierStore);

	// Stok rendah
	let stokRendah = $derived(
		barangList
			.filter((b) => b.statusStok !== 'normal')
			.sort((a, b) => a.stok - b.stok)
			.slice(0, 6)
	);

	// Aktivitas terbaru (merge masuk & keluar, sort by date)
	let aktivitasTerbaru = $derived(() => {
		const masukItems = transaksiMasuk.slice(-8).map((t) => ({
			id: t.id,
			type: 'masuk' as const,
			barangNama: barangList.find((b) => b.id === t.barangId)?.nama ?? '-',
			jumlah: t.jumlah,
			tanggal: t.tanggal,
			keterangan: t.noFaktur
		}));
		const keluarItems = transaksiKeluar.slice(-8).map((t) => ({
			id: t.id,
			type: 'keluar' as const,
			barangNama: barangList.find((b) => b.id === t.barangId)?.nama ?? '-',
			jumlah: t.jumlah,
			tanggal: t.tanggal,
			keterangan: t.tujuan
		}));
		return [...masukItems, ...keluarItems]
			.sort((a, b) => b.tanggal.localeCompare(a.tanggal))
			.slice(0, 8);
	});

	// Kategori stats
	let kategoriStats = $derived(
		kategoriList.map((k) => {
			const barangKategori = barangList.filter((b) => b.kategoriId === k.id);
			return {
				...k,
				jumlahBarang: barangKategori.length,
				totalStok: barangKategori.reduce((s, b) => s + b.stok, 0),
				nilaiInventori: barangKategori.reduce((s, b) => s + b.stok * b.hargaBeli, 0)
			};
		})
	);

	// Transaksi per 7 hari (chart data)
	let chartData = $derived(() => {
		const days: { label: string; masuk: number; keluar: number }[] = [];
		for (let i = 6; i >= 0; i--) {
			const d = new Date();
			d.setDate(d.getDate() - i);
			const dateStr = d.toISOString().split('T')[0];
			const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short' });
			const masuk = transaksiMasuk
				.filter((t) => t.tanggal === dateStr)
				.reduce((s, t) => s + t.jumlah, 0);
			const keluar = transaksiKeluar
				.filter((t) => t.tanggal === dateStr)
				.reduce((s, t) => s + t.jumlah, 0);
			days.push({ label: dayLabel, masuk, keluar });
		}
		return days;
	});

	// Max value for chart scaling
	let chartMax = $derived(() => {
		const data = chartData();
		return Math.max(...data.map((d) => Math.max(d.masuk, d.keluar)), 1);
	});

	// Donut chart for kategori
	let donutData = $derived(() => {
		const total = barangList.length;
		if (total === 0) return [];
		return kategoriStats
			.filter((k) => k.jumlahBarang > 0)
			.map((k) => ({
				...k,
				percentage: Math.round((k.jumlahBarang / total) * 100)
			}));
	});
</script>

<div class="space-y-6 p-4 lg:p-6">
	<!-- KPI Cards -->
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<StatsCard
			title="Total Barang"
			value={formatNumber(stats.totalBarang)}
			subtitle="{stats.stokMenipis} menipis · {stats.stokHabis} habis"
			icon={Package}
			gradient="blue"
			trend={5}
			trendLabel="vs bulan lalu"
		/>
		<StatsCard
			title="Total Unit Stok"
			value={formatNumber(stats.totalStok)}
			subtitle="Semua kategori"
			icon={Boxes}
			gradient="teal"
			trend={2}
			trendLabel="vs bulan lalu"
		/>
		<StatsCard
			title="Nilai Inventori"
			value={formatRupiah(stats.nilaiInventori)}
			subtitle="Berdasarkan harga beli"
			icon={TrendingUp}
			gradient="emerald"
			trend={8}
			trendLabel="vs bulan lalu"
		/>
		<StatsCard
			title="Transaksi Hari Ini"
			value={formatNumber(stats.transaksiHariIni)}
			subtitle="Masuk + Keluar"
			icon={ShoppingCart}
			gradient="purple"
		/>
	</div>

	<!-- Charts row -->
	<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
		<!-- Bar chart - 7 hari transaksi -->
		<Card.Root class="xl:col-span-2 shadow-sm border-border/50">
			<Card.Header class="pb-4">
				<div class="flex items-center justify-between">
					<Card.Title class="text-base font-semibold">Transaksi 7 Hari Terakhir</Card.Title>
					<div class="flex items-center gap-4 text-xs font-medium text-muted-foreground">
						<span class="flex items-center gap-1.5"
							><span class="size-2.5 rounded-sm bg-blue-500"></span>Masuk</span
						>
						<span class="flex items-center gap-1.5"
							><span class="size-2.5 rounded-sm bg-rose-400"></span>Keluar</span
						>
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="flex h-44 items-end gap-2 sm:gap-4">
					{#each chartData() as day}
						<div class="flex flex-1 flex-col items-center gap-3">
							<div class="flex h-32 w-full items-end gap-1.5 sm:gap-2">
								<!-- Masuk bar -->
								<div
									class="group relative flex-1 rounded-t-md bg-blue-500 hover:bg-blue-600 transition-colors"
									style="height: {Math.max(4, (day.masuk / chartMax()) * 100)}%"
								>
									{#if day.masuk > 0}
										<div
											class="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-[10px] font-bold text-background opacity-0 shadow-sm transition-all group-hover:-top-9 group-hover:opacity-100 pointer-events-none"
										>
											{day.masuk}
										</div>
									{/if}
								</div>
								<!-- Keluar bar -->
								<div
									class="group relative flex-1 rounded-t-md bg-rose-400 hover:bg-rose-500 transition-colors"
									style="height: {Math.max(4, (day.keluar / chartMax()) * 100)}%"
								>
									{#if day.keluar > 0}
										<div
											class="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-[10px] font-bold text-background opacity-0 shadow-sm transition-all group-hover:-top-9 group-hover:opacity-100 pointer-events-none"
										>
											{day.keluar}
										</div>
									{/if}
								</div>
							</div>
							<p class="text-xs font-medium text-muted-foreground capitalize">{day.label}</p>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Donut / Kategori distribution -->
		<Card.Root class="shadow-sm border-border/50">
			<Card.Header class="pb-2">
				<Card.Title class="text-base font-semibold">Distribusi Kategori</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-4 pt-2">
				{#each donutData() as k}
					<div class="group">
						<div class="mb-1.5 flex items-center justify-between">
							<span class="text-xs font-semibold text-foreground">{k.nama}</span>
							<span class="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">{k.jumlahBarang} item</span>
						</div>
						<div class="h-2 overflow-hidden rounded-full bg-secondary">
							<div
								class="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
								style="width: {k.percentage}%; background-color: {k.warna}"
							></div>
						</div>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Bottom row -->
	<div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
		<!-- Stok Rendah -->
		<Card.Root class="shadow-sm border-border/50">
			<Card.Header class="pb-2 border-b border-border/40 mb-2">
				<div class="flex items-center justify-between">
					<Card.Title class="flex items-center gap-2 text-base font-semibold">
						<div class="p-1.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500">
							<AlertTriangle class="size-4" />
						</div>
						Perlu Perhatian
					</Card.Title>
					<a href="/barang" class="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
						Lihat semua <ArrowUpRight class="size-3" />
					</a>
				</div>
			</Card.Header>
			<Card.Content class="space-y-1 p-0">
				{#if stokRendah.length === 0}
					<div class="py-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
						<div class="size-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex flex-col items-center justify-center text-emerald-600 dark:text-emerald-400">
							<Package class="size-5" />
						</div>
						<p>Semua stok dalam kondisi normal</p>
					</div>
				{:else}
					{#each stokRendah as b}
						<div class="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0">
							<div
								class="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground"
							>
								{b.kode.slice(0, 3)}
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between mb-1">
									<p class="truncate text-sm font-semibold text-foreground">{b.nama}</p>
									<span
										class="ml-2 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider {b.statusStok === 'habis'
											? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
											: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}"
									>
										{b.stok} {b.satuan}
									</span>
								</div>
								<div class="h-1.5 overflow-hidden rounded-full bg-secondary">
									<div
										class="h-full rounded-full transition-all {b.statusStok === 'habis'
											? 'bg-rose-500'
											: 'bg-amber-500'}"
										style="width: {Math.min(
											100,
											Math.max(5, (b.stok / (b.stokMinimum * 2)) * 100)
										)}%"
									></div>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</Card.Content>
		</Card.Root>

		<!-- Aktivitas Terbaru -->
		<Card.Root class="shadow-sm border-border/50">
			<Card.Header class="pb-2 border-b border-border/40 mb-2">
				<div class="flex items-center justify-between">
					<Card.Title class="text-base font-semibold flex items-center gap-2">
						<div class="p-1.5 rounded-md bg-primary/10 text-primary">
							<TrendingUp class="size-4" />
						</div>
						Aktivitas Terbaru
					</Card.Title>
					<div class="flex gap-3">
						<a href="/transaksi/masuk" class="text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors">Masuk</a>
						<span class="text-border">|</span>
						<a href="/transaksi/keluar" class="text-[11px] font-semibold text-muted-foreground hover:text-rose-500 transition-colors">Keluar</a>
					</div>
				</div>
			</Card.Header>
			<Card.Content class="p-0">
				{#each aktivitasTerbaru() as item}
					<div class="flex items-center gap-4 p-3 hover:bg-muted/50 transition-colors border-b border-border/40 last:border-0 group cursor-default">
						<div
							class="flex size-9 flex-shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-110 {item.type ===
							'masuk'
								? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/30'
								: 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/30'}"
						>
							{#if item.type === 'masuk'}
								<ArrowDownRight class="size-4" />
							{:else}
								<ArrowUpRight class="size-4" />
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-semibold text-foreground">{item.barangNama}</p>
							<p class="text-xs text-muted-foreground tracking-wide mt-0.5">
								<span class="font-medium text-foreground/70">{item.keterangan}</span> • {formatDateShort(item.tanggal)}
							</p>
						</div>
						<div
							class="text-sm font-bold {item.type === 'masuk'
								? 'text-blue-600 dark:text-blue-400'
								: 'text-rose-600 dark:text-rose-400'}"
						>
							{item.type === 'masuk' ? '+' : '-'}{item.jumlah}
						</div>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
</div>
