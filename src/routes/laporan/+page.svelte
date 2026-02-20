<script lang="ts">
	import { Printer, BarChart3, TrendingUp, TrendingDown } from 'lucide-svelte';
	import {
		barangWithRelations,
		transaksiMasukStore,
		transaksiKeluarStore,
		kategoriStore
	} from '$lib/stores';
	import { formatRupiah, formatNumber, formatDateShort } from '$lib/utils/helpers';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';

	let barangList = $derived($barangWithRelations);
	let masukList = $derived($transaksiMasukStore);
	let keluarList = $derived($transaksiKeluarStore);
	let kategoriList = $derived($kategoriStore);

	// Date range
	const getDateMonthsAgo = (n: number) => {
		const d = new Date();
		d.setMonth(d.getMonth() - n);
		return d.toISOString().split('T')[0];
	};
	let dateFrom = $state(getDateMonthsAgo(1));
	let dateTo = $state(new Date().toISOString().split('T')[0]);

	let filteredMasuk = $derived(
		masukList.filter((t) => t.tanggal >= dateFrom && t.tanggal <= dateTo)
	);
	let filteredKeluar = $derived(
		keluarList.filter((t) => t.tanggal >= dateFrom && t.tanggal <= dateTo)
	);

	let totalNilaiMasuk = $derived(filteredMasuk.reduce((s, t) => s + t.totalHarga, 0));
	let totalUnitMasuk = $derived(filteredMasuk.reduce((s, t) => s + t.jumlah, 0));
	let totalUnitKeluar = $derived(filteredKeluar.reduce((s, t) => s + t.jumlah, 0));
	let nilaiInventori = $derived(barangList.reduce((s, b) => s + b.stok * b.hargaBeli, 0));
	let nilaiJual = $derived(barangList.reduce((s, b) => s + b.stok * b.hargaJual, 0));
	let potensiLaba = $derived(nilaiJual - nilaiInventori);

	let kategoriReport = $derived(
		kategoriList
			.map((k) => {
				const items = barangList.filter((b) => b.kategoriId === k.id);
				return {
					...k,
					jumlahBarang: items.length,
					totalStok: items.reduce((s, b) => s + b.stok, 0),
					nilaiInventori: items.reduce((s, b) => s + b.stok * b.hargaBeli, 0),
					nilaiJual: items.reduce((s, b) => s + b.stok * b.hargaJual, 0)
				};
			})
			.sort((a, b) => b.nilaiInventori - a.nilaiInventori)
	);

	let topBarangMasuk = $derived(() => {
		const map: Record<string, number> = {};
		filteredMasuk.forEach((t) => {
			map[t.barangId] = (map[t.barangId] ?? 0) + t.jumlah;
		});
		return Object.entries(map)
			.map(([id, jumlah]) => ({ barang: barangList.find((b) => b.id === id), jumlah }))
			.filter((x) => x.barang)
			.sort((a, b) => b.jumlah - a.jumlah)
			.slice(0, 5);
	});

	let topBarangKeluar = $derived(() => {
		const map: Record<string, number> = {};
		filteredKeluar.forEach((t) => {
			map[t.barangId] = (map[t.barangId] ?? 0) + t.jumlah;
		});
		return Object.entries(map)
			.map(([id, jumlah]) => ({ barang: barangList.find((b) => b.id === id), jumlah }))
			.filter((x) => x.barang)
			.sort((a, b) => b.jumlah - a.jumlah)
			.slice(0, 5);
	});

	function print() {
		window.print();
	}
</script>

<div class="space-y-5 p-4 lg:p-6 print:p-0">
	<!-- Header -->
	<div class="no-print flex flex-col gap-3 sm:flex-row sm:items-center">
		<div>
			<h2 class="text-xl font-bold text-foreground">Laporan Inventori</h2>
			<p class="text-sm text-muted-foreground">Ringkasan pergerakan dan nilai barang</p>
		</div>
		<div class="flex items-center gap-3 sm:ml-auto">
			<div class="flex items-center gap-2">
				<Label class="text-xs whitespace-nowrap text-muted-foreground">Dari</Label>
				<Input type="date" bind:value={dateFrom} class="h-8 text-sm" />
				<Label class="text-xs text-muted-foreground">s/d</Label>
				<Input type="date" bind:value={dateTo} class="h-8 text-sm" />
			</div>
			<Button onclick={print} variant="outline" class="gap-2">
				<Printer class="size-4" /> Cetak
			</Button>
		</div>
	</div>

	<!-- Print title -->
	<div class="print-only py-4 text-center">
		<h1 class="text-xl font-bold">Laporan Inventori Barang</h1>
		<p class="text-sm text-gray-600">
			Periode: {formatDateShort(dateFrom)} – {formatDateShort(dateTo)}
		</p>
	</div>

	<!-- KPI -->
	<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
		{#each [{ label: 'Nilai Inventori', value: formatRupiah(nilaiInventori), sub: 'Harga beli', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' }, { label: 'Nilai Jual', value: formatRupiah(nilaiJual), sub: 'Harga jual', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' }, { label: 'Potensi Laba', value: formatRupiah(potensiLaba), sub: 'Jual - Beli', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' }, { label: 'Total Pembelian', value: formatRupiah(totalNilaiMasuk), sub: 'Periode ini', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' }] as kpi}
			<div class="rounded-xl border border-border p-4 {kpi.bg}">
				<p class="text-xs text-muted-foreground">{kpi.label}</p>
				<p class="mt-1 text-xl font-bold {kpi.color}">{kpi.value}</p>
				<p class="mt-0.5 text-xs text-muted-foreground">{kpi.sub}</p>
			</div>
		{/each}
	</div>

	<div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
		<!-- Laporan per kategori -->
		<Card.Root>
			<Card.Header class="pb-3">
				<Card.Title class="text-base">Nilai Inventori per Kategori</Card.Title>
			</Card.Header>
			<Card.Content>
				<table class="w-full text-sm">
					<thead>
						<tr class="border-b border-border text-xs text-muted-foreground">
							<th class="pb-2 text-left">Kategori</th>
							<th class="pb-2 text-center">Barang</th>
							<th class="pb-2 text-right">Total Stok</th>
							<th class="pb-2 text-right">Nilai Beli</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border">
						{#each kategoriReport as k}
							<tr class="text-xs">
								<td class="py-2">
									<div class="flex items-center gap-2">
										<span class="size-2.5 rounded-full" style="background-color: {k.warna}"></span>
										<span class="font-medium text-foreground">{k.nama}</span>
									</div>
								</td>
								<td class="py-2 text-center text-muted-foreground">{k.jumlahBarang}</td>
								<td class="py-2 text-right text-muted-foreground">{formatNumber(k.totalStok)}</td>
								<td class="py-2 text-right font-semibold text-foreground"
									>{formatRupiah(k.nilaiInventori)}</td
								>
							</tr>
						{/each}
					</tbody>
					<tfoot>
						<tr class="border-t-2 border-border text-xs font-bold">
							<td class="pt-2">Total</td>
							<td class="pt-2 text-center">{barangList.length}</td>
							<td class="pt-2 text-right"
								>{formatNumber(barangList.reduce((s, b) => s + b.stok, 0))}</td
							>
							<td class="pt-2 text-right">{formatRupiah(nilaiInventori)}</td>
						</tr>
					</tfoot>
				</table>
			</Card.Content>
		</Card.Root>

		<!-- Top barang -->
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-base">Top Pergerakan Barang</Card.Title>
				<p class="text-xs text-muted-foreground">Periode yang dipilih</p>
			</Card.Header>
			<Card.Content>
				<div class="space-y-4">
					<div>
						<p
							class="mb-2 flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400"
						>
							<TrendingUp class="size-3" /> Terbanyak Masuk
						</p>
						{#each topBarangMasuk() as item}
							<div
								class="flex items-center justify-between border-b border-border py-1.5 last:border-0"
							>
								<span class="truncate text-sm text-foreground">{item.barang?.nama}</span>
								<span
									class="ml-2 flex-shrink-0 text-sm font-semibold text-blue-600 dark:text-blue-400"
									>+{item.jumlah}</span
								>
							</div>
						{:else}
							<p class="text-xs text-muted-foreground">Tidak ada data</p>
						{/each}
					</div>
					<div>
						<p
							class="mb-2 flex items-center gap-1 text-xs font-medium text-rose-600 dark:text-rose-400"
						>
							<TrendingDown class="size-3" /> Terbanyak Keluar
						</p>
						{#each topBarangKeluar() as item}
							<div
								class="flex items-center justify-between border-b border-border py-1.5 last:border-0"
							>
								<span class="truncate text-sm text-foreground">{item.barang?.nama}</span>
								<span
									class="ml-2 flex-shrink-0 text-sm font-semibold text-rose-600 dark:text-rose-400"
									>-{item.jumlah}</span
								>
							</div>
						{:else}
							<p class="text-xs text-muted-foreground">Tidak ada data</p>
						{/each}
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Stok rendah report -->
	<Card.Root>
		<Card.Header class="pb-3">
			<Card.Title class="text-base">Barang Perlu Restock</Card.Title>
		</Card.Header>
		<Card.Content>
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border text-xs text-muted-foreground">
						<th class="pb-2 text-left">Kode</th>
						<th class="pb-2 text-left">Nama Barang</th>
						<th class="pb-2 text-left">Kategori</th>
						<th class="pb-2 text-center">Stok Saat Ini</th>
						<th class="pb-2 text-center">Stok Minimum</th>
						<th class="pb-2 text-center">Status</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each barangList.filter((b) => b.statusStok !== 'normal') as b}
						<tr class="text-xs">
							<td class="py-2 font-mono">{b.kode}</td>
							<td class="py-2 font-medium text-foreground">{b.nama}</td>
							<td class="py-2 text-muted-foreground">{b.kategori?.nama ?? '-'}</td>
							<td
								class="py-2 text-center font-semibold {b.statusStok === 'habis'
									? 'text-red-600'
									: 'text-amber-600'}">{b.stok}</td
							>
							<td class="py-2 text-center text-muted-foreground">{b.stokMinimum}</td>
							<td class="py-2 text-center">
								<span
									class="rounded-full px-2 py-0.5 text-xs font-medium {b.statusStok === 'habis'
										? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
										: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'}"
								>
									{b.statusStok === 'habis' ? 'Habis' : 'Menipis'}
								</span>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="6" class="py-6 text-center text-muted-foreground"
								>✅ Semua stok normal</td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</Card.Content>
	</Card.Root>
</div>
