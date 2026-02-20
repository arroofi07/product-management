<script lang="ts">
	import {
		Save,
		RotateCcw,
		Download,
		Upload,
		Building2,
		Settings2,
		Moon,
		Sun
	} from 'lucide-svelte';
	import { settingsStore, resetToSeedData, darkMode } from '$lib/stores';
	import { formatRupiah } from '$lib/utils/helpers';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { storage } from '$lib/services/storage';

	let settings = $derived($settingsStore);
	let confirmResetOpen = $state(false);
	let savedMsg = $state(false);

	let form = $state({
		namaPerusahaan: '',
		alamatPerusahaan: '',
		teleponPerusahaan: '',
		emailPerusahaan: '',
		stokMinimumDefault: 5
	});

	// Initialize form with current settings
	$effect(() => {
		form.namaPerusahaan = settings.namaPerusahaan;
		form.alamatPerusahaan = settings.alamatPerusahaan;
		form.teleponPerusahaan = settings.teleponPerusahaan;
		form.emailPerusahaan = settings.emailPerusahaan;
		form.stokMinimumDefault = settings.stokMinimumDefault;
	});

	function save() {
		settingsStore.update(form);
		savedMsg = true;
		setTimeout(() => (savedMsg = false), 2000);
	}

	function doReset() {
		resetToSeedData();
		confirmResetOpen = false;
	}

	function toggleDark() {
		settingsStore.update({ darkMode: !settings.darkMode });
		$darkMode = !$darkMode;
		if ($darkMode) document.documentElement.classList.add('dark');
		else document.documentElement.classList.remove('dark');
	}

	function exportData() {
		const data = {
			kategori: storage.get('kategori'),
			supplier: storage.get('supplier'),
			barang: storage.get('barang'),
			transaksiMasuk: storage.get('transaksiMasuk'),
			transaksiKeluar: storage.get('transaksiKeluar'),
			settings: storage.get('settings'),
			exportedAt: new Date().toISOString()
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `inventori-backup-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	function importData(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const data = JSON.parse(ev.target?.result as string);
				if (data.kategori) storage.set('kategori', data.kategori);
				if (data.supplier) storage.set('supplier', data.supplier);
				if (data.barang) storage.set('barang', data.barang);
				if (data.transaksiMasuk) storage.set('transaksiMasuk', data.transaksiMasuk);
				if (data.transaksiKeluar) storage.set('transaksiKeluar', data.transaksiKeluar);
				if (data.settings) storage.set('settings', data.settings);
				window.location.reload();
			} catch {
				alert('File tidak valid!');
			}
		};
		reader.readAsText(file);
	}
</script>

<div class="max-w-2xl space-y-6 p-4 lg:p-6">
	<div>
		<h2 class="text-xl font-bold text-foreground">Pengaturan</h2>
		<p class="text-sm text-muted-foreground">Konfigurasi aplikasi dan data perusahaan</p>
	</div>

	<!-- Informasi Perusahaan -->
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2 text-base">
				<Building2 class="size-4 text-primary" />
				Informasi Perusahaan
			</Card.Title>
		</Card.Header>
		<Card.Content class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="col-span-2 space-y-1.5">
					<Label>Nama Perusahaan</Label>
					<Input bind:value={form.namaPerusahaan} />
				</div>
				<div class="col-span-2 space-y-1.5">
					<Label>Alamat</Label>
					<Input bind:value={form.alamatPerusahaan} />
				</div>
				<div class="space-y-1.5">
					<Label>Telepon</Label>
					<Input bind:value={form.teleponPerusahaan} />
				</div>
				<div class="space-y-1.5">
					<Label>Email</Label>
					<Input type="email" bind:value={form.emailPerusahaan} />
				</div>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Pengaturan Stok -->
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center gap-2 text-base">
				<Settings2 class="size-4 text-primary" />
				Pengaturan Stok
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="space-y-1.5">
				<Label>Stok Minimum Default</Label>
				<Input type="number" bind:value={form.stokMinimumDefault} min="0" class="w-40" />
				<p class="text-xs text-muted-foreground">Nilai default stok minimum untuk barang baru</p>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Tampilan -->
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-base">Tampilan</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-foreground">Mode Gelap</p>
					<p class="text-xs text-muted-foreground">Aktifkan tampilan dark mode</p>
				</div>
				<button
					onclick={toggleDark}
					class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {$darkMode
						? 'bg-primary'
						: 'bg-muted'}"
				>
					<span class="sr-only">Toggle dark mode</span>
					<span
						class="inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform {$darkMode
							? 'translate-x-6'
							: 'translate-x-1'}"
					></span>
				</button>
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Save button -->
	<div class="flex items-center gap-3">
		<Button onclick={save} class="gap-2">
			<Save class="size-4" />
			Simpan Pengaturan
		</Button>
		{#if savedMsg}
			<span class="text-sm text-emerald-600 dark:text-emerald-400">✓ Tersimpan!</span>
		{/if}
	</div>

	<!-- Data Management -->
	<Card.Root>
		<Card.Header>
			<Card.Title class="text-base">Manajemen Data</Card.Title>
			<p class="text-xs text-muted-foreground">Backup, restore, dan reset data</p>
		</Card.Header>
		<Card.Content class="space-y-3">
			<div class="flex flex-col gap-3 sm:flex-row">
				<Button variant="outline" onclick={exportData} class="flex-1 gap-2">
					<Download class="size-4" />
					Export Data (JSON)
				</Button>
				<label class="flex-1">
					<Button variant="outline" class="w-full cursor-pointer gap-2" ta	g="div">
						<Upload class="size-4" />
						Import Data (JSON)
					</Button>
					<input type="file" accept=".json" class="hidden" onchange={importData} />
				</label>
			</div>
			<div class="border-t border-border pt-3">
				<div class="flex items-start justify-between gap-4">
					<div>
						<p class="text-sm font-medium text-foreground">Reset ke Data Demo</p>
						<p class="text-xs text-muted-foreground">
							Kembalikan semua data ke seed data awal. <span class="font-medium text-destructive"
								>Semua perubahan akan hilang.</span
							>
						</p>
					</div>
					<Button
						variant="destructive"
						size="sm"
						onclick={() => (confirmResetOpen = true)}
						class="flex-shrink-0 gap-2"
					>
						<RotateCcw class="size-4" />
						Reset
					</Button>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>

<Dialog.Root bind:open={confirmResetOpen}>
	<Dialog.Content class="sm:max-w-sm">
		<Dialog.Header>
			<Dialog.Title>Reset Semua Data?</Dialog.Title>
			<Dialog.Description
				>Semua data yang Anda buat atau ubah akan hilang dan diganti kembali dengan data demo awal.
				Tindakan ini tidak dapat dibatalkan.</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (confirmResetOpen = false)}>Batal</Button>
			<Button variant="destructive" onclick={doReset}>Ya, Reset Sekarang</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
