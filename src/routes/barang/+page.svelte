<script lang="ts">
	import {
		Plus,
		Search,
		Filter,
		Pencil,
		Trash2,
		Package,
		ChevronLeft,
		ChevronRight,
		ArrowUpDown,
		X
	} from 'lucide-svelte';
	import { barangWithRelations, barangStore, kategoriStore, supplierStore } from '$lib/stores';
	import { formatRupiah, formatNumber, formatDateShort } from '$lib/utils/helpers';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import type { Barang } from '$lib/types';

	let barangList = $derived($barangWithRelations);
	let kategoriList = $derived($kategoriStore);
	let supplierList = $derived($supplierStore);

	// Filters
	let searchQuery = $state('');
	let filterKategori = $state('');
	let filterStatus = $state('');
	let sortField = $state<keyof Barang>('nama');
	let sortDir = $state<'asc' | 'desc'>('asc');
	let currentPage = $state(1);
	const perPage = 10;

	// Filtered & sorted list
	let filtered = $derived(() => {
		let list = barangList;
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			list = list.filter(
				(b) =>
					b.nama.toLowerCase().includes(q) ||
					b.kode.toLowerCase().includes(q) ||
					b.kategori?.nama.toLowerCase().includes(q) ||
					b.supplier?.nama.toLowerCase().includes(q)
			);
		}
		if (filterKategori) list = list.filter((b) => b.kategoriId === filterKategori);
		if (filterStatus) list = list.filter((b) => b.statusStok === filterStatus);
		list = [...list].sort((a, b) => {
			const va = String(a[sortField] ?? '');
			const vb = String(b[sortField] ?? '');
			return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
		});
		return list;
	});

	let totalPages = $derived(Math.max(1, Math.ceil(filtered().length / perPage)));
	let paginated = $derived(filtered().slice((currentPage - 1) * perPage, currentPage * perPage));
	$effect(() => {
		if (currentPage > totalPages) currentPage = 1;
	});

	// Dialog state
	let dialogOpen = $state(false);
	let confirmDeleteOpen = $state(false);
	let editingId = $state<string | null>(null);
	let deleteTarget = $state<string | null>(null);

	// Form
	let form = $state({
		kode: '',
		nama: '',
		deskripsi: '',
		kategoriId: '',
		supplierId: '',
		stok: 0,
		stokMinimum: 5,
		satuan: 'Unit',
		hargaBeli: 0,
		hargaJual: 0,
		lokasi: ''
	});

	function openAdd() {
		editingId = null;
		form = {
			kode: '',
			nama: '',
			deskripsi: '',
			kategoriId: '',
			supplierId: '',
			stok: 0,
			stokMinimum: 5,
			satuan: 'Unit',
			hargaBeli: 0,
			hargaJual: 0,
			lokasi: ''
		};
		dialogOpen = true;
	}

	function openEdit(b: (typeof barangList)[0]) {
		editingId = b.id;
		form = {
			kode: b.kode,
			nama: b.nama,
			deskripsi: b.deskripsi,
			kategoriId: b.kategoriId,
			supplierId: b.supplierId,
			stok: b.stok,
			stokMinimum: b.stokMinimum,
			satuan: b.satuan,
			hargaBeli: b.hargaBeli,
			hargaJual: b.hargaJual,
			lokasi: b.lokasi
		};
		dialogOpen = true;
	}

	function saveBarang() {
		if (!form.nama || !form.kategoriId || !form.supplierId) return;
		if (editingId) {
			barangStore.update(editingId, form);
		} else {
			barangStore.add(form);
		}
		dialogOpen = false;
	}

	function confirmDelete(id: string) {
		deleteTarget = id;
		confirmDeleteOpen = true;
	}

	function doDelete() {
		if (deleteTarget) barangStore.remove(deleteTarget);
		confirmDeleteOpen = false;
		deleteTarget = null;
	}

	function toggleSort(field: keyof Barang) {
		if (sortField === field) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
		else {
			sortField = field;
			sortDir = 'asc';
		}
	}

	function getStatusBadgeClass(status: string) {
		if (status === 'habis')
			return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200';
		if (status === 'menipis')
			return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200';
		return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200';
	}
	function getStatusLabel(s: string) {
		return s === 'habis' ? 'Habis' : s === 'menipis' ? 'Menipis' : 'Normal';
	}
</script>

<div class="space-y-5 p-4 lg:p-6">
	<!-- Header -->
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
		<div>
			<h2 class="text-xl font-bold text-foreground">Daftar Barang</h2>
			<p class="text-sm text-muted-foreground">{barangList.length} barang terdaftar</p>
		</div>
		<div class="sm:ml-auto">
			<Button onclick={openAdd} class="gap-2">
				<Plus class="size-4" />
				Tambah Barang
			</Button>
		</div>
	</div>

	<!-- Filters -->
	<Card.Root class="p-4">
		<div class="flex flex-col gap-3 sm:flex-row">
			<div class="relative flex-1">
				<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input placeholder="Cari nama, kode, kategori..." bind:value={searchQuery} class="pl-9" />
			</div>
			<select
				bind:value={filterKategori}
				class="h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
			>
				<option value="">Semua Kategori</option>
				{#each kategoriList as k}
					<option value={k.id}>{k.nama}</option>
				{/each}
			</select>
			<select
				bind:value={filterStatus}
				class="h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
			>
				<option value="">Semua Status</option>
				<option value="normal">Normal</option>
				<option value="menipis">Menipis</option>
				<option value="habis">Habis</option>
			</select>
			{#if searchQuery || filterKategori || filterStatus}
				<Button
					variant="outline"
					onclick={() => {
						searchQuery = '';
						filterKategori = '';
						filterStatus = '';
					}}
					class="gap-1"
				>
					<X class="size-3" /> Reset
				</Button>
			{/if}
		</div>
	</Card.Root>

	<!-- Table -->
	<Card.Root>
		<div class="overflow-x-auto">
			<table class="w-full text-sm">
				<thead>
					<tr class="border-b border-border bg-muted/30">
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">
							<button
								class="flex items-center gap-1 hover:text-foreground"
								onclick={() => toggleSort('kode')}
							>
								Kode <ArrowUpDown class="size-3" />
							</button>
						</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">
							<button
								class="flex items-center gap-1 hover:text-foreground"
								onclick={() => toggleSort('nama')}
							>
								Nama Barang <ArrowUpDown class="size-3" />
							</button>
						</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
						<th class="px-4 py-3 text-left font-medium text-muted-foreground">Supplier</th>
						<th class="px-4 py-3 text-center font-medium text-muted-foreground">
							<button
								class="mx-auto flex items-center gap-1 hover:text-foreground"
								onclick={() => toggleSort('stok')}
							>
								Stok <ArrowUpDown class="size-3" />
							</button>
						</th>
						<th class="px-4 py-3 text-right font-medium text-muted-foreground">Harga Jual</th>
						<th class="px-4 py-3 text-center font-medium text-muted-foreground">Status</th>
						<th class="px-4 py-3 text-center font-medium text-muted-foreground">Aksi</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each paginated as b}
						<tr class="transition-colors hover:bg-muted/30">
							<td class="px-4 py-3">
								<span class="rounded bg-muted px-2 py-1 font-mono text-xs">{b.kode}</span>
							</td>
							<td class="px-4 py-3">
								<div>
									<p class="font-medium text-foreground">{b.nama}</p>
									<p class="text-xs text-muted-foreground">{b.lokasi}</p>
								</div>
							</td>
							<td class="px-4 py-3">
								{#if b.kategori}
									<span
										class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium"
										style="background-color: {b.kategori.warna}20; color: {b.kategori
											.warna}; border-color: {b.kategori.warna}50"
									>
										{b.kategori.nama}
									</span>
								{:else}
									<span class="text-xs text-muted-foreground">-</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-sm text-muted-foreground">{b.supplier?.nama ?? '-'}</td>
							<td class="px-4 py-3 text-center">
								<span class="font-semibold text-foreground">{formatNumber(b.stok)}</span>
								<span class="ml-1 text-xs text-muted-foreground">{b.satuan}</span>
							</td>
							<td class="px-4 py-3 text-right font-medium text-foreground"
								>{formatRupiah(b.hargaJual)}</td
							>
							<td class="px-4 py-3 text-center">
								<span
									class="inline-flex rounded-full border px-2 py-0.5 text-xs font-medium {getStatusBadgeClass(
										b.statusStok
									)}"
								>
									{getStatusLabel(b.statusStok)}
								</span>
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center justify-center gap-1">
									<button
										class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
										onclick={() => openEdit(b)}
									>
										<Pencil class="size-3.5" />
									</button>
									<button
										class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive dark:hover:bg-red-900/20"
										onclick={() => confirmDelete(b.id)}
									>
										<Trash2 class="size-3.5" />
									</button>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="8" class="px-4 py-12 text-center text-muted-foreground">
								<Package class="size-8 mx-auto mb-2 opacity-30" />
								<p>Tidak ada barang ditemukan</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Pagination -->
		{#if totalPages > 1}
			<div class="flex items-center justify-between border-t border-border px-4 py-3">
				<p class="text-xs text-muted-foreground">
					{(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered().length)} dari
					{filtered().length}
				</p>
				<div class="flex items-center gap-1">
					<Button
						variant="outline"
						size="sm"
						onclick={() => currentPage--}
						disabled={currentPage === 1}
					>
						<ChevronLeft class="size-4" />
					</Button>
					{#each Array.from({ length: totalPages }, (_, i) => i + 1) as p}
						<Button
							variant={p === currentPage ? 'default' : 'outline'}
							size="sm"
							onclick={() => (currentPage = p)}
							class="w-8">{p}</Button
						>
					{/each}
					<Button
						variant="outline"
						size="sm"
						onclick={() => currentPage++}
						disabled={currentPage === totalPages}
					>
						<ChevronRight class="size-4" />
					</Button>
				</div>
			</div>
		{/if}
	</Card.Root>
</div>

<!-- Form Dialog -->
<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-xl">
		<Dialog.Header>
			<Dialog.Title>{editingId ? 'Edit Barang' : 'Tambah Barang'}</Dialog.Title>
			<Dialog.Description>Lengkapi informasi barang berikut</Dialog.Description>
		</Dialog.Header>
		<div class="grid grid-cols-2 gap-4 py-2">
			<div class="space-y-1.5">
				<Label>Kode SKU</Label>
				<Input bind:value={form.kode} placeholder="e.g. ELK-001" />
			</div>
			<div class="space-y-1.5">
				<Label>Satuan</Label>
				<Input bind:value={form.satuan} placeholder="Unit / Rim / Pcs" />
			</div>
			<div class="col-span-2 space-y-1.5">
				<Label>Nama Barang *</Label>
				<Input bind:value={form.nama} placeholder="Nama barang" />
			</div>
			<div class="col-span-2 space-y-1.5">
				<Label>Deskripsi</Label>
				<Input bind:value={form.deskripsi} placeholder="Deskripsi singkat" />
			</div>
			<div class="space-y-1.5">
				<Label>Kategori *</Label>
				<select
					bind:value={form.kategoriId}
					class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
				>
					<option value="">Pilih kategori</option>
					{#each kategoriList as k}
						<option value={k.id}>{k.nama}</option>
					{/each}
				</select>
			</div>
			<div class="space-y-1.5">
				<Label>Supplier *</Label>
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
			<div class="space-y-1.5">
				<Label>Stok Awal</Label>
				<Input type="number" bind:value={form.stok} min="0" />
			</div>
			<div class="space-y-1.5">
				<Label>Stok Minimum</Label>
				<Input type="number" bind:value={form.stokMinimum} min="0" />
			</div>
			<div class="space-y-1.5">
				<Label>Harga Beli (Rp)</Label>
				<Input type="number" bind:value={form.hargaBeli} min="0" />
			</div>
			<div class="space-y-1.5">
				<Label>Harga Jual (Rp)</Label>
				<Input type="number" bind:value={form.hargaJual} min="0" />
			</div>
			<div class="col-span-2 space-y-1.5">
				<Label>Lokasi Penyimpanan</Label>
				<Input bind:value={form.lokasi} placeholder="Rak A-1" />
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (dialogOpen = false)}>Batal</Button>
			<Button onclick={saveBarang}>Simpan</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Confirm -->
<Dialog.Root bind:open={confirmDeleteOpen}>
	<Dialog.Content class="sm:max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Hapus Barang?</Dialog.Title>
			<Dialog.Description
				>Data barang ini akan dihapus permanen dan tidak dapat dikembalikan.</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (confirmDeleteOpen = false)}>Batal</Button>
			<Button variant="destructive" onclick={doDelete}>Hapus</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
