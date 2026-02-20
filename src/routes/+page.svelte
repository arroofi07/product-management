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
		<Card.Root class="xl:col-span-2">
			<Card.Header class="pb-2">
				<div class="flex items-center justify-between">
					<Card.Title class="text-base">Transaksi 7 Hari Terakhir</Card.Title>
					<div class="flex items-center gap-4 text-xs text-muted-foreground">
						<span class="flex items-center gap-1.5"
							><span class="size-2.5 rounded-full bg-blue-500"></span>Masuk</span
						>
						<span class="flex items-center gap-1.5"
							><span class="size-2.5 rounded-full bg-red-400"></span>Keluar</span
						>
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<div class="flex h-36 items-end gap-2">
					{#each chartData() as day}
						<div class="flex flex-1 flex-col items-center gap-1">
							<div class="flex h-28 w-full items-end gap-1">
								<!-- Masuk bar -->
								<div
									class="group relative flex-1 rounded-t-md border-t-2 border-blue-500 bg-blue-500/20"
									style="height: {Math.max(4, (day.masuk / chartMax()) * 100)}%"
								>
									{#if day.masuk > 0}
										<div
											class="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-blue-600 px-1.5 py-0.5 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
										>
											{day.masuk}
										</div>
									{/if}
								</div>
								<!-- Keluar bar -->
								<div
									class="group relative flex-1 rounded-t-md border-t-2 border-red-400 bg-red-400/20"
									style="height: {Math.max(4, (day.keluar / chartMax()) * 100)}%"
								>
									{#if day.keluar > 0}
										<div
											class="absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-red-500 px-1.5 py-0.5 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100"
										>
											{day.keluar}
										</div>
									{/if}
								</div>
							</div>
							<p class="text-xs text-muted-foreground capitalize">{day.label}</p>
						</div>
					{/each}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Donut / Kategori distribution -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Distribusi Kategori</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-2">
				{#each donutData() as k}
					<div>
						<div class="mb-1 flex items-center justify-between">
							<span class="text-xs font-medium text-foreground">{k.nama}</span>
							<span class="text-xs text-muted-foreground">{k.jumlahBarang} item</span>
						</div>
						<div class="h-2 overflow-hidden rounded-full bg-muted">
							<div
								class="h-full rounded-full transition-all duration-700"
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
		<Card.Root>
			<Card.Header class="pb-3">
				<div class="flex items-center justify-between">
					<Card.Title class="flex items-center gap-2 text-base">
						<AlertTriangle class="size-4 text-amber-500" />
						Perlu Perhatian
					</Card.Title>
					<a href="/barang" class="flex items-center gap-1 text-xs text-primary hover:underline">
						Lihat semua <Eye class="size-3" />
					</a>
				</div>
			</Card.Header>
			<Card.Content class="space-y-3">
				{#if stokRendah.length === 0}
					<div class="py-6 text-center text-sm text-muted-foreground">
						✅ Semua stok dalam kondisi normal
					</div>
				{:else}
					{#each stokRendah as b}
						<div class="flex items-center gap-3">
							<div
								class="flex size-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-medium text-muted-foreground"
							>
								{b.kode.slice(0, 3)}
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center justify-between">
									<p class="truncate text-sm font-medium text-foreground">{b.nama}</p>
									<span
										class="ml-2 text-xs font-semibold {b.statusStok === 'habis'
											? 'text-red-600'
											: 'text-amber-600'}">{b.stok} {b.satuan}</span
									>
								</div>
								<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
									<div
										class="h-full rounded-full transition-all {b.statusStok === 'habis'
											? 'bg-red-500'
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
		<Card.Root>
			<Card.Header class="pb-3">
				<div class="flex items-center justify-between">
					<Card.Title class="text-base">Aktivitas Terbaru</Card.Title>
					<div class="flex gap-2">
						<a href="/transaksi/masuk" class="text-xs text-primary hover:underline">Masuk</a>
						<span class="text-muted-foreground">·</span>
						<a href="/transaksi/keluar" class="text-xs text-primary hover:underline">Keluar</a>
					</div>
				</div>
			</Card.Header>
			<Card.Content class="space-y-2.5">
				{#each aktivitasTerbaru() as item}
					<div class="flex items-center gap-3 py-1">
						<div
							class="flex size-7 flex-shrink-0 items-center justify-center rounded-full {item.type ===
							'masuk'
								? 'bg-blue-100 dark:bg-blue-500/20'
								: 'bg-red-100 dark:bg-red-500/20'}"
						>
							{#if item.type === 'masuk'}
								<ArrowUpRight class="size-3.5 text-blue-600 dark:text-blue-400" />
							{:else}
								<ArrowDownRight class="size-3.5 text-red-600 dark:text-red-400" />
							{/if}
						</div>
						<div class="min-w-0 flex-1">
							<p class="truncate text-sm font-medium text-foreground">{item.barangNama}</p>
							<p class="text-xs text-muted-foreground">
								{item.keterangan} · {formatDateShort(item.tanggal)}
							</p>
						</div>
						<span
							class="text-sm font-semibold {item.type === 'masuk'
								? 'text-blue-600 dark:text-blue-400'
								: 'text-red-600 dark:text-red-400'}"
						>
							{item.type === 'masuk' ? '+' : '-'}{item.jumlah}
						</span>
					</div>
				{/each}
			</Card.Content>
		</Card.Root>
	</div>
</div>
