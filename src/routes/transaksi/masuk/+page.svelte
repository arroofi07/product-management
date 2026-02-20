<script lang="ts">
	import { Plus, Trash2, ArrowDownToLine, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { transaksiMasukStore, barangWithRelations, supplierStore } from '$lib/stores';
	import { formatRupiah, formatDateShort, generateNoFaktur } from '$lib/utils/helpers';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';

	let transaksiList = $derived(
		[...$transaksiMasukStore].sort((a, b) => b.tanggal.localeCompare(a.tanggal))
	);
	let barangList = $derived($barangWithRelations);
	let supplierList = $derived($supplierStore);

	let currentPage = $state(1);
	const perPage = 10;
	let totalPages = $derived(Math.max(1, Math.ceil(transaksiList.length / perPage)));
	let paginated = $derived(transaksiList.slice((currentPage - 1) * perPage, currentPage * perPage));

	let dialogOpen = $state(false);
	let confirmDeleteOpen = $state(false);
	let deleteTarget = $state<string | null>(null);

	let form = $state({
		noFaktur: '',
		barangId: '',
		supplierId: '',
		jumlah: 1,
		hargaSatuan: 0,
		tanggal: new Date().toISOString().split('T')[0],
		catatan: ''
	});

	let totalHarga = $derived(form.jumlah * form.hargaSatuan);

	function openAdd() {
		form = {
			noFaktur: generateNoFaktur(),
			barangId: '',
			supplierId: '',
			jumlah: 1,
			hargaSatuan: 0,
			tanggal: new Date().toISOString().split('T')[0],
			catatan: ''
		};
		dialogOpen = true;
	}

	// Auto-fill harga beli when barang selected
	$effect(() => {
		if (form.barangId) {
			const b = barangList.find((b) => b.id === form.barangId);
			if (b) {
				form.hargaSatuan = b.hargaBeli;
				form.supplierId = b.supplierId;
			}
		}
	});

	function save() {
		if (!form.barangId || form.jumlah <= 0) return;
		transaksiMasukStore.add({ ...form, totalHarga });
		dialogOpen = false;
	}
	function confirmDelete(id: string) {
		deleteTarget = id;
		confirmDeleteOpen = true;
	}
	function doDelete() {
		if (deleteTarget) transaksiMasukStore.remove(deleteTarget);
		confirmDeleteOpen = false;
	}
</script>

<div class="space-y-5 p-4 lg:p-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-xl font-bold text-foreground">Barang Masuk</h2>
			<p class="text-sm text-muted-foreground">{transaksiList.length} transaksi penerimaan</p>
		</div>
		<Button onclick={openAdd} class="gap-2">
			<Plus class="size-4" /> Catat Masuk
		</Button>
	</div>

	<Card.Root>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-muted/30">
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">No. Faktur</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Barang</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Supplier</th>
						<th class="px-4 py-3 text-center font-medium text-muted-foreground">Jumlah</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Harga Satuan</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Total</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Tanggal</th>
						<th class="px-4 py-3 text-center font-medium text-muted-foreground">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginated as t}
						{@const barang = barangList.find((b) => b.id === t.barangId)}
						{@const supplier = supplierList.find((s) => s.id === t.supplierId)}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-3">
								<span
									class="rounded bg-blue-50 px-2 py-1 font-mono text-xs text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
									>{t.noFaktur}</span
								>
							</td>
							<td class="px-4 py-3 font-medium text-foreground">{barang?.nama ?? '-'}</td>
							<td class="px-4 py-3 text-muted-foreground">{supplier?.nama ?? '-'}</td>
							<td class="px-4 py-3 text-center">
								<span class="font-semibold text-green-600 dark:text-green-400">+{t.jumlah}</span>
								<span class="ml-1 text-xs text-muted-foreground">{barang?.satuan ?? ''}</span>
							</td>
							<td class="px-4 py-3 text-right text-muted-foreground"
								>{formatRupiah(t.hargaSatuan)}</td
							>
							<td class="px-4 py-3 text-right font-semibold text-foreground"
								>{formatRupiah(t.totalHarga)}</td
							>
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
							<td colspan="8" class="px-4 py-12 text-center text-muted-foreground">
								<ArrowDownToLine class="size-8 mx-auto mb-2 opacity-30" />
								<p>Belum ada transaksi masuk</p>
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
			<Dialog.Title>Catat Barang Masuk</Dialog.Title>
			<Dialog.Description>Stok barang akan otomatis bertambah</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-2">
			<div class="space-y-1.5">
				<Label>No. Faktur</Label>
				<Input bind:value={form.noFaktur} />
			</div>
			<div class="space-y-1.5">
				<Label>Barang *</Label>
				<select
					bind:value={form.barangId}
					class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
				>
					<option value="">Pilih barang</option>
					{#each barangList as b}
						<option value={b.id}>{b.kode} - {b.nama}</option>
					{/each}
				</select>
			</div>
			<div class="space-y-1.5">
				<Label>Supplier</Label>
				<select
					bind:value={form.supplierId}
					class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
				>
					<option value="">Pilih supplier</option>
					{#each supplierList as s}
						<option value={s.id}>{s.nama}</option>
					{/each}
				</select>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-1.5">
					<Label>Jumlah *</Label>
					<Input type="number" bind:value={form.jumlah} min="1" />
				</div>
				<div class="space-y-1.5">
					<Label>Harga Satuan (Rp)</Label>
					<Input type="number" bind:value={form.hargaSatuan} min="0" />
				</div>
			</div>
			<div class="space-y-1.5">
				<Label>Tanggal</Label>
				<Input type="date" bind:value={form.tanggal} />
			</div>
			<div class="space-y-1.5">
				<Label>Catatan</Label>
				<Input bind:value={form.catatan} placeholder="Opsional" />
			</div>
			<div
				class="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/30 dark:bg-blue-500/10"
			>
				<span class="text-sm text-blue-700 dark:text-blue-400">Total Pembelian</span>
				<span class="font-bold text-blue-700 dark:text-blue-400">{formatRupiah(totalHarga)}</span>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (dialogOpen = false)}>Batal</Button>
			<Button onclick={save}>Simpan & Tambah Stok</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={confirmDeleteOpen}>
	<Dialog.Content class="sm:max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Hapus Transaksi?</Dialog.Title>
			<Dialog.Description
				>Stok barang akan dikurangi kembali sesuai jumlah transaksi ini.</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (confirmDeleteOpen = false)}>Batal</Button>
			<Button variant="destructive" onclick={doDelete}>Hapus</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
