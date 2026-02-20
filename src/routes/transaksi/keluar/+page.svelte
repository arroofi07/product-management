<script lang="ts">
	import { Plus, Trash2, ArrowUpFromLine, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { transaksiKeluarStore, barangWithRelations } from '$lib/stores';
	import { formatDateShort, generateNoReferensi } from '$lib/utils/helpers';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';

	let transaksiList = $derived(
		[...$transaksiKeluarStore].sort((a, b) => b.tanggal.localeCompare(a.tanggal))
	);
	let barangList = $derived($barangWithRelations);

	let currentPage = $state(1);
	const perPage = 10;
	let totalPages = $derived(Math.max(1, Math.ceil(transaksiList.length / perPage)));
	let paginated = $derived(transaksiList.slice((currentPage - 1) * perPage, currentPage * perPage));

	let dialogOpen = $state(false);
	let confirmDeleteOpen = $state(false);
	let deleteTarget = $state<string | null>(null);

	let form = $state({
		noReferensi: '',
		barangId: '',
		jumlah: 1,
		tujuan: '',
		alasan: 'Penggunaan internal',
		tanggal: new Date().toISOString().split('T')[0],
		catatan: ''
	});

	let selectedBarang = $derived(
		form.barangId ? barangList.find((b) => b.id === form.barangId) : null
	);
	let insufficientStock = $derived(selectedBarang ? form.jumlah > selectedBarang.stok : false);

	function openAdd() {
		form = {
			noReferensi: generateNoReferensi(),
			barangId: '',
			jumlah: 1,
			tujuan: '',
			alasan: 'Penggunaan internal',
			tanggal: new Date().toISOString().split('T')[0],
			catatan: ''
		};
		dialogOpen = true;
	}
	function save() {
		if (!form.barangId || form.jumlah <= 0 || insufficientStock) return;
		transaksiKeluarStore.add(form);
		dialogOpen = false;
	}
	function confirmDelete(id: string) {
		deleteTarget = id;
		confirmDeleteOpen = true;
	}
	function doDelete() {
		if (deleteTarget) transaksiKeluarStore.remove(deleteTarget);
		confirmDeleteOpen = false;
	}

	const alasanOptions = [
		'Penggunaan internal',
		'Penggantian rusak',
		'Dipinjam/disewa',
		'Donasi/sumbangan',
		'Habis pakai',
		'Lainnya'
	];
</script>

<div class="space-y-5 p-4 lg:p-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-xl font-bold text-foreground">Barang Keluar</h2>
			<p class="text-sm text-muted-foreground">{transaksiList.length} transaksi pengeluaran</p>
		</div>
		<Button onclick={openAdd} class="gap-2 bg-rose-600 hover:bg-rose-700">
			<Plus class="size-4" /> Catat Keluar
		</Button>
	</div>

	<Card.Root>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-muted/30">
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">No. Referensi</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Barang</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Tujuan</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Alasan</th>
						<th class="px-4 py-3 text-center font-medium text-muted-foreground">Jumlah</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
						<th class="px-4 py-3 text-center font-medium text-muted-foreground">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginated as t}
						{@const barang = barangList.find((b) => b.id === t.barangId)}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-3">
								<span
									class="rounded bg-rose-50 px-2 py-1 font-mono text-xs text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
									>{t.noReferensi}</span
								>
							</td>
							<td class="px-4 py-3 font-medium text-foreground">{barang?.nama ?? '-'}</td>
							<td class="px-4 py-3 text-muted-foreground">{t.tujuan}</td>
							<td class="px-4 py-3 text-muted-foreground">{t.alasan}</td>
							<td class="px-4 py-3 text-center">
								<span class="font-semibold text-rose-600 dark:text-rose-400">-{t.jumlah}</span>
								<span class="ml-1 text-xs text-muted-foreground">{barang?.satuan ?? ''}</span>
							</td>
							<td class="px-4 py-3 text-muted-foreground">{formatDateShort(t.tanggal)}</td>
							<td class="px-4 py-3 text-center">
								<button
									class="mx-auto flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive dark:hover:bg-red-900/20"
									onclick={() => confirmDelete(t.id)}
								>
									<Trash2 class="size-3.5" />
								</button>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="7" class="px-4 py-12 text-center text-muted-foreground">
								<ArrowUpFromLine class="size-8 mx-auto mb-2 opacity-30" />
								<p>Belum ada transaksi keluar</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		{#if totalPages > 1}
			<div class="flex items-center justify-between border-t border-border px-4 py-3">
				<p class="text-xs text-muted-foreground">{transaksiList.length} transaksi</p>
				<div class="flex items-center gap-1">
					<Button
						variant="outline"
						size="sm"
						onclick={() => currentPage--}
						disabled={currentPage === 1}><ChevronLeft class="size-4" /></Button
					>
					<span class="px-3 text-xs">{currentPage} / {totalPages}</span>
					<Button
						variant="outline"
						size="sm"
						onclick={() => currentPage++}
						disabled={currentPage === totalPages}><ChevronRight class="size-4" /></Button
					>
				</div>
			</div>
		{/if}
	</Card.Root>
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Catat Barang Keluar</Dialog.Title>
			<Dialog.Description>Stok barang akan otomatis berkurang</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-2">
			<div class="space-y-1.5">
				<Label>No. Referensi</Label>
				<Input bind:value={form.noReferensi} />
			</div>
			<div class="space-y-1.5">
				<Label>Barang *</Label>
				<select
					bind:value={form.barangId}
					class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
				>
					<option value="">Pilih barang</option>
					{#each barangList as b}
						<option value={b.id}>{b.kode} - {b.nama} (Stok: {b.stok} {b.satuan})</option>
					{/each}
				</select>
			</div>
			<div class="space-y-1.5">
				<Label>Jumlah *</Label>
				<Input type="number" bind:value={form.jumlah} min="1" max={selectedBarang?.stok ?? 9999} />
				{#if insufficientStock}
					<p class="text-xs text-destructive">
						Stok tidak mencukupi! Tersedia: {selectedBarang?.stok}
					</p>
				{/if}
				{#if selectedBarang}
					<p class="text-xs text-muted-foreground">
						Stok saat ini: {selectedBarang.stok}
						{selectedBarang.satuan}
					</p>
				{/if}
			</div>
			<div class="space-y-1.5">
				<Label>Tujuan</Label>
				<Input bind:value={form.tujuan} placeholder="Divisi / departemen" />
			</div>
			<div class="space-y-1.5">
				<Label>Alasan</Label>
				<select
					bind:value={form.alasan}
					class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
				>
					{#each alasanOptions as a}
						<option value={a}>{a}</option>
					{/each}
				</select>
			</div>
			<div class="space-y-1.5">
				<Label>Tanggal</Label>
				<Input type="date" bind:value={form.tanggal} />
			</div>
			<div class="space-y-1.5">
				<Label>Catatan</Label>
				<Input bind:value={form.catatan} placeholder="Opsional" />
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (dialogOpen = false)}>Batal</Button>
			<Button onclick={save} disabled={insufficientStock} class="bg-rose-600 hover:bg-rose-700"
				>Simpan & Kurangi Stok</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={confirmDeleteOpen}>
	<Dialog.Content class="sm:max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Hapus Transaksi?</Dialog.Title>
			<Dialog.Description
				>Stok barang akan dikembalikan sesuai jumlah transaksi ini.</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (confirmDeleteOpen = false)}>Batal</Button>
			<Button variant="destructive" onclick={doDelete}>Hapus</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
