<script lang="ts">
	import { Plus, Pencil, Trash2, Mail, Phone, MapPin, Building2, Search } from 'lucide-svelte';
	import { supplierStore, barangWithRelations } from '$lib/stores';
	import { formatDateShort } from '$lib/utils/helpers';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';

	let supplierList = $derived($supplierStore);
	let barangList = $derived($barangWithRelations);
	let searchQuery = $state('');

	let filtered = $derived(
		searchQuery
			? supplierList.filter(
					(s) =>
						s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
						s.kota.toLowerCase().includes(searchQuery.toLowerCase()) ||
						s.kode.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: supplierList
	);

	let dialogOpen = $state(false);
	let confirmDeleteOpen = $state(false);
	let editingId = $state<string | null>(null);
	let deleteTarget = $state<string | null>(null);

	let form = $state({
		kode: '',
		nama: '',
		kontak: '',
		email: '',
		alamat: '',
		kota: '',
		status: 'aktif' as 'aktif' | 'nonaktif'
	});

	function getJumlahBarang(supId: string) {
		return barangList.filter((b) => b.supplierId === supId).length;
	}

	function openAdd() {
		editingId = null;
		form = { kode: '', nama: '', kontak: '', email: '', alamat: '', kota: '', status: 'aktif' };
		dialogOpen = true;
	}
	function openEdit(s: (typeof supplierList)[0]) {
		editingId = s.id;
		form = {
			kode: s.kode,
			nama: s.nama,
			kontak: s.kontak,
			email: s.email,
			alamat: s.alamat,
			kota: s.kota,
			status: s.status
		};
		dialogOpen = true;
	}
	function save() {
		if (!form.nama) return;
		if (editingId) supplierStore.update(editingId, form);
		else supplierStore.add(form);
		dialogOpen = false;
	}
	function confirmDelete(id: string) {
		deleteTarget = id;
		confirmDeleteOpen = true;
	}
	function doDelete() {
		if (deleteTarget) supplierStore.remove(deleteTarget);
		confirmDeleteOpen = false;
	}
</script>

<div class="space-y-5 p-4 lg:p-6">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
		<div>
			<h2 class="text-xl font-bold text-foreground">Supplier</h2>
			<p class="text-sm text-muted-foreground">
				{supplierList.length} supplier terdaftar · {supplierList.filter((s) => s.status === 'aktif')
					.length} aktif
			</p>
		</div>
		<div class="flex gap-2 sm:ml-auto">
			<div class="relative">
				<Search class="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
				<Input placeholder="Cari supplier..." bind:value={searchQuery} class="w-48 pl-9" />
			</div>
			<Button onclick={openAdd} class="gap-2">
				<Plus class="size-4" /> Tambah
			</Button>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
		{#each filtered as s}
			{@const jumlah = getJumlahBarang(s.id)}
			<Card.Root class="group transition-all duration-200 hover:shadow-md">
				<Card.Content class="p-5">
					<div class="mb-3 flex items-start justify-between">
						<div class="flex items-center gap-3">
							<div
								class="gradient-blue flex size-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
							>
								{s.nama.charAt(0)}
							</div>
							<div>
								<p class="text-sm font-semibold text-foreground">{s.nama}</p>
								<span class="font-mono text-xs text-muted-foreground">{s.kode}</span>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span
								class="rounded-full border px-2 py-0.5 text-xs font-medium {s.status === 'aktif'
									? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400'
									: 'border-border bg-muted text-muted-foreground'}"
							>
								{s.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
							</span>
						</div>
					</div>

					<div class="space-y-1.5 text-xs text-muted-foreground">
						<div class="flex items-center gap-2">
							<Phone class="size-3.5 flex-shrink-0" />
							<span>{s.kontak}</span>
						</div>
						<div class="flex items-center gap-2">
							<Mail class="size-3.5 flex-shrink-0" />
							<span class="truncate">{s.email}</span>
						</div>
						<div class="flex items-start gap-2">
							<MapPin class="mt-0.5 size-3.5 flex-shrink-0" />
							<span>{s.alamat}, {s.kota}</span>
						</div>
					</div>

					<div class="mt-4 flex items-center justify-between border-t border-border pt-3">
						<div>
							<span class="text-lg font-bold text-primary">{jumlah}</span>
							<span class="ml-1 text-xs text-muted-foreground">barang</span>
						</div>
						<div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
							<button
								class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
								onclick={() => openEdit(s)}
							>
								<Pencil class="size-3.5" />
							</button>
							<button
								class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive dark:hover:bg-red-900/20"
								onclick={() => confirmDelete(s.id)}
							>
								<Trash2 class="size-3.5" />
							</button>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{:else}
			<div class="md:col-span-2 xl:col-span-3 py-16 text-center text-muted-foreground">
				<Building2 class="size-10 mx-auto mb-2 opacity-30" />
				<p>Tidak ada supplier ditemukan</p>
			</div>
		{/each}
	</div>
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>{editingId ? 'Edit' : 'Tambah'} Supplier</Dialog.Title>
		</Dialog.Header>
		<div class="grid grid-cols-2 gap-4 py-2">
			<div class="space-y-1.5">
				<Label>Kode</Label>
				<Input bind:value={form.kode} placeholder="SUP001" />
			</div>
			<div class="space-y-1.5">
				<Label>Status</Label>
				<select
					bind:value={form.status}
					class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
				>
					<option value="aktif">Aktif</option>
					<option value="nonaktif">Nonaktif</option>
				</select>
			</div>
			<div class="col-span-2 space-y-1.5">
				<Label>Nama *</Label>
				<Input bind:value={form.nama} placeholder="Nama perusahaan" />
			</div>
			<div class="space-y-1.5">
				<Label>No. Kontak</Label>
				<Input bind:value={form.kontak} placeholder="021-xxx" />
			</div>
			<div class="space-y-1.5">
				<Label>Email</Label>
				<Input type="email" bind:value={form.email} placeholder="email@supplier.com" />
			</div>
			<div class="col-span-2 space-y-1.5">
				<Label>Alamat</Label>
				<Input bind:value={form.alamat} placeholder="Jl. ..." />
			</div>
			<div class="col-span-2 space-y-1.5">
				<Label>Kota</Label>
				<Input bind:value={form.kota} placeholder="Jakarta" />
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (dialogOpen = false)}>Batal</Button>
			<Button onclick={save}>Simpan</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={confirmDeleteOpen}>
	<Dialog.Content class="sm:max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Hapus Supplier?</Dialog.Title>
			<Dialog.Description>Data supplier akan dihapus permanen.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (confirmDeleteOpen = false)}>Batal</Button>
			<Button variant="destructive" onclick={doDelete}>Hapus</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
