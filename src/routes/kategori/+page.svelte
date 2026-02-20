<script lang="ts">
	import { Plus, Pencil, Trash2, Tags } from 'lucide-svelte';
	import { kategoriStore, barangWithRelations } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let kategoriList = $derived($kategoriStore);
	let barangList = $derived($barangWithRelations);

	const defaultColors = [
		'#3b82f6',
		'#8b5cf6',
		'#f59e0b',
		'#10b981',
		'#ef4444',
		'#06b6d4',
		'#f97316',
		'#ec4899'
	];
	const defaultIcons = [
		'Package',
		'Cpu',
		'Briefcase',
		'Armchair',
		'Pen',
		'Monitor',
		'Sparkles',
		'ShoppingBag'
	];

	let dialogOpen = $state(false);
	let confirmDeleteOpen = $state(false);
	let editingId = $state<string | null>(null);
	let deleteTarget = $state<string | null>(null);

	let form = $state({ nama: '', deskripsi: '', warna: '#3b82f6', icon: 'Package' });

	function getJumlahBarang(katId: string) {
		return barangList.filter((b) => b.kategoriId === katId).length;
	}

	function openAdd() {
		editingId = null;
		form = {
			nama: '',
			deskripsi: '',
			warna: defaultColors[kategoriList.length % defaultColors.length],
			icon: 'Package'
		};
		dialogOpen = true;
	}
	function openEdit(k: (typeof kategoriList)[0]) {
		editingId = k.id;
		form = { nama: k.nama, deskripsi: k.deskripsi, warna: k.warna, icon: k.icon };
		dialogOpen = true;
	}
	function save() {
		if (!form.nama) return;
		if (editingId) kategoriStore.update(editingId, form);
		else kategoriStore.add(form);
		dialogOpen = false;
	}
	function confirmDelete(id: string) {
		deleteTarget = id;
		confirmDeleteOpen = true;
	}
	function doDelete() {
		if (deleteTarget) kategoriStore.remove(deleteTarget);
		confirmDeleteOpen = false;
	}
</script>

<div class="space-y-5 p-4 lg:p-6">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-xl font-bold text-foreground">Kategori Barang</h2>
			<p class="text-sm text-muted-foreground">{kategoriList.length} kategori</p>
		</div>
		<Button onclick={openAdd} class="gap-2">
			<Plus class="size-4" /> Tambah Kategori
		</Button>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each kategoriList as k}
			{@const jumlah = getJumlahBarang(k.id)}
			<div
				class="group rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:shadow-md"
			>
				<div class="mb-4 flex items-start justify-between">
					<div
						class="flex size-12 items-center justify-center rounded-xl text-lg font-bold text-white"
						style="background-color: {k.warna}"
					>
						{k.nama.charAt(0)}
					</div>
					<div class="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
						<button
							class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
							onclick={() => openEdit(k)}
						>
							<Pencil class="size-3.5" />
						</button>
						<button
							class="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive dark:hover:bg-red-900/20"
							onclick={() => confirmDelete(k.id)}
						>
							<Trash2 class="size-3.5" />
						</button>
					</div>
				</div>
				<h3 class="font-semibold text-foreground">{k.nama}</h3>
				<p class="mt-0.5 text-xs text-muted-foreground">{k.deskripsi}</p>
				<div class="mt-3 flex items-center justify-between border-t border-border pt-3">
					<span class="text-2xl font-bold" style="color: {k.warna}">{jumlah}</span>
					<span class="text-xs text-muted-foreground">barang</span>
				</div>
			</div>
		{/each}

		<!-- Add new card -->
		<button
			class="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-5 text-muted-foreground transition-all duration-200 hover:border-border/80 hover:bg-muted/50 hover:text-foreground"
			onclick={openAdd}
		>
			<Plus class="size-8" />
			<span class="text-sm font-medium">Tambah Kategori</span>
		</button>
	</div>
</div>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-sm">
		<Dialog.Header>
			<Dialog.Title>{editingId ? 'Edit' : 'Tambah'} Kategori</Dialog.Title>
		</Dialog.Header>
		<div class="space-y-4 py-2">
			<div class="space-y-1.5">
				<Label>Nama Kategori *</Label>
				<Input bind:value={form.nama} placeholder="e.g. Elektronik" />
			</div>
			<div class="space-y-1.5">
				<Label>Deskripsi</Label>
				<Input bind:value={form.deskripsi} placeholder="Deskripsi singkat" />
			</div>
			<div class="space-y-1.5">
				<Label>Warna</Label>
				<div class="flex items-center gap-3">
					<input
						type="color"
						bind:value={form.warna}
						class="size-10 cursor-pointer rounded-lg border-2 border-border"
					/>
					<div class="flex flex-wrap gap-2">
						{#each defaultColors as c}
							<button
								class="size-7 rounded-lg border-2 transition-transform hover:scale-110 {form.warna ===
								c
									? 'scale-110 border-foreground'
									: 'border-transparent'}"
								style="background-color: {c}"
								onclick={() => (form.warna = c)}
							></button>
						{/each}
					</div>
				</div>
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
			<Dialog.Title>Hapus Kategori?</Dialog.Title>
			<Dialog.Description
				>Barang yang masuk kategori ini tidak akan terhapus, hanya kategorinya saja.</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (confirmDeleteOpen = false)}>Batal</Button>
			<Button variant="destructive" onclick={doDelete}>Hapus</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
