import { writable, derived, get } from 'svelte/store';
import { storage } from '$lib/services/storage';
import type {
	Barang,
	Kategori,
	Supplier,
	TransaksiMasuk,
	TransaksiKeluar,
	AppSettings,
	BarangWithRelations,
	DashboardStats
} from '$lib/types';
import {
	seedBarang,
	seedKategori,
	seedSupplier,
	seedTransaksiMasuk,
	seedTransaksiKeluar,
	seedSettings
} from '$lib/data/seed';

// ========================
// Utility: generate ID
// ========================
export function generateId(prefix = 'item'): string {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function generateKode(prefix: string, list: { kode: string }[]): string {
	const max = list.reduce((acc, item) => {
		const num = parseInt(item.kode.replace(/\D/g, '')) || 0;
		return Math.max(acc, num);
	}, 0);
	return `${prefix}${String(max + 1).padStart(3, '0')}`;
}

// ========================
// Initialize localStorage data (run seed if first time)
// ========================
function initData() {
	if (!storage.has('initialized')) {
		storage.set('kategori', seedKategori);
		storage.set('supplier', seedSupplier);
		storage.set('barang', seedBarang);
		storage.set('transaksiMasuk', seedTransaksiMasuk);
		storage.set('transaksiKeluar', seedTransaksiKeluar);
		storage.set('settings', seedSettings);
		storage.set('initialized', true);
	}
}

export function resetToSeedData() {
	storage.clear();
	storage.set('kategori', seedKategori);
	storage.set('supplier', seedSupplier);
	storage.set('barang', seedBarang);
	storage.set('transaksiMasuk', seedTransaksiMasuk);
	storage.set('transaksiKeluar', seedTransaksiKeluar);
	storage.set('settings', seedSettings);
	storage.set('initialized', true);
	// Reload stores
	kategoriStore.reload();
	supplierStore.reload();
	barangStore.reload();
	transaksiMasukStore.reload();
	transaksiKeluarStore.reload();
	settingsStore.reload();
}

// ========================
// Kategori Store
// ========================
function createKategoriStore() {
	initData();
	const { subscribe, set } = writable<Kategori[]>(
		storage.get<Kategori[]>('kategori') ?? []
	);

	return {
		subscribe,
		reload: () => set(storage.get<Kategori[]>('kategori') ?? []),
		add: (item: Omit<Kategori, 'id' | 'createdAt'>) => {
			const newItem: Kategori = {
				...item,
				id: generateId('kat'),
				createdAt: new Date().toISOString()
			};
			const updated = [...(storage.get<Kategori[]>('kategori') ?? []), newItem];
			storage.set('kategori', updated);
			set(updated);
			return newItem;
		},
		update: (id: string, data: Partial<Kategori>) => {
			const list = storage.get<Kategori[]>('kategori') ?? [];
			const updated = list.map((k) => (k.id === id ? { ...k, ...data } : k));
			storage.set('kategori', updated);
			set(updated);
		},
		remove: (id: string) => {
			const list = storage.get<Kategori[]>('kategori') ?? [];
			const updated = list.filter((k) => k.id !== id);
			storage.set('kategori', updated);
			set(updated);
		}
	};
}

// ========================
// Supplier Store
// ========================
function createSupplierStore() {
	initData();
	const { subscribe, set } = writable<Supplier[]>(
		storage.get<Supplier[]>('supplier') ?? []
	);

	return {
		subscribe,
		reload: () => set(storage.get<Supplier[]>('supplier') ?? []),
		add: (item: Omit<Supplier, 'id' | 'createdAt'>) => {
			const newItem: Supplier = {
				...item,
				id: generateId('sup'),
				createdAt: new Date().toISOString()
			};
			const updated = [...(storage.get<Supplier[]>('supplier') ?? []), newItem];
			storage.set('supplier', updated);
			set(updated);
			return newItem;
		},
		update: (id: string, data: Partial<Supplier>) => {
			const list = storage.get<Supplier[]>('supplier') ?? [];
			const updated = list.map((s) => (s.id === id ? { ...s, ...data } : s));
			storage.set('supplier', updated);
			set(updated);
		},
		remove: (id: string) => {
			const list = storage.get<Supplier[]>('supplier') ?? [];
			const updated = list.filter((s) => s.id !== id);
			storage.set('supplier', updated);
			set(updated);
		}
	};
}

// ========================
// Barang Store
// ========================
function createBarangStore() {
	initData();
	const { subscribe, set } = writable<Barang[]>(
		storage.get<Barang[]>('barang') ?? []
	);

	return {
		subscribe,
		reload: () => set(storage.get<Barang[]>('barang') ?? []),
		add: (item: Omit<Barang, 'id' | 'createdAt' | 'updatedAt'>) => {
			const newItem: Barang = {
				...item,
				id: generateId('brg'),
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			};
			const updated = [...(storage.get<Barang[]>('barang') ?? []), newItem];
			storage.set('barang', updated);
			set(updated);
			return newItem;
		},
		update: (id: string, data: Partial<Barang>) => {
			const list = storage.get<Barang[]>('barang') ?? [];
			const updated = list.map((b) =>
				b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b
			);
			storage.set('barang', updated);
			set(updated);
		},
		updateStok: (id: string, delta: number) => {
			const list = storage.get<Barang[]>('barang') ?? [];
			const updated = list.map((b) =>
				b.id === id
					? { ...b, stok: Math.max(0, b.stok + delta), updatedAt: new Date().toISOString() }
					: b
			);
			storage.set('barang', updated);
			set(updated);
		},
		remove: (id: string) => {
			const list = storage.get<Barang[]>('barang') ?? [];
			const updated = list.filter((b) => b.id !== id);
			storage.set('barang', updated);
			set(updated);
		}
	};
}

// ========================
// Transaksi Masuk Store
// ========================
function createTransaksiMasukStore() {
	initData();
	const { subscribe, set } = writable<TransaksiMasuk[]>(
		storage.get<TransaksiMasuk[]>('transaksiMasuk') ?? []
	);

	return {
		subscribe,
		reload: () => set(storage.get<TransaksiMasuk[]>('transaksiMasuk') ?? []),
		add: (item: Omit<TransaksiMasuk, 'id' | 'createdAt'>) => {
			const newItem: TransaksiMasuk = {
				...item,
				id: generateId('tm'),
				createdAt: new Date().toISOString()
			};
			const updated = [...(storage.get<TransaksiMasuk[]>('transaksiMasuk') ?? []), newItem];
			storage.set('transaksiMasuk', updated);
			set(updated);
			// Update stok barang
			barangStore.updateStok(item.barangId, item.jumlah);
			return newItem;
		},
		remove: (id: string) => {
			const list = storage.get<TransaksiMasuk[]>('transaksiMasuk') ?? [];
			const item = list.find((t) => t.id === id);
			const updated = list.filter((t) => t.id !== id);
			storage.set('transaksiMasuk', updated);
			set(updated);
			// Reverse stok
			if (item) barangStore.updateStok(item.barangId, -item.jumlah);
		}
	};
}

// ========================
// Transaksi Keluar Store
// ========================
function createTransaksiKeluarStore() {
	initData();
	const { subscribe, set } = writable<TransaksiKeluar[]>(
		storage.get<TransaksiKeluar[]>('transaksiKeluar') ?? []
	);

	return {
		subscribe,
		reload: () => set(storage.get<TransaksiKeluar[]>('transaksiKeluar') ?? []),
		add: (item: Omit<TransaksiKeluar, 'id' | 'createdAt'>) => {
			const newItem: TransaksiKeluar = {
				...item,
				id: generateId('tk'),
				createdAt: new Date().toISOString()
			};
			const updated = [...(storage.get<TransaksiKeluar[]>('transaksiKeluar') ?? []), newItem];
			storage.set('transaksiKeluar', updated);
			set(updated);
			// Decrease stok
			barangStore.updateStok(item.barangId, -item.jumlah);
			return newItem;
		},
		remove: (id: string) => {
			const list = storage.get<TransaksiKeluar[]>('transaksiKeluar') ?? [];
			const item = list.find((t) => t.id === id);
			const updated = list.filter((t) => t.id !== id);
			storage.set('transaksiKeluar', updated);
			set(updated);
			// Reverse stok
			if (item) barangStore.updateStok(item.barangId, item.jumlah);
		}
	};
}

// ========================
// Settings Store
// ========================
function createSettingsStore() {
	initData();
	const { subscribe, set } = writable<AppSettings>(
		storage.get<AppSettings>('settings') ?? seedSettings
	);

	return {
		subscribe,
		reload: () => set(storage.get<AppSettings>('settings') ?? seedSettings),
		update: (data: Partial<AppSettings>) => {
			const current = storage.get<AppSettings>('settings') ?? seedSettings;
			const updated = { ...current, ...data };
			storage.set('settings', updated);
			set(updated);
		}
	};
}

// ========================
// Instantiate stores
// ========================
export const kategoriStore = createKategoriStore();
export const supplierStore = createSupplierStore();
export const barangStore = createBarangStore();
export const transaksiMasukStore = createTransaksiMasukStore();
export const transaksiKeluarStore = createTransaksiKeluarStore();
export const settingsStore = createSettingsStore();

// ========================
// UI Stores
// ========================
export const sidebarOpen = writable(true);
export const darkMode = writable(false);

// ========================
// Derived: Barang with relations
// ========================
export const barangWithRelations = derived(
	[barangStore, kategoriStore, supplierStore],
	([$barang, $kategori, $supplier]) =>
		$barang.map((b): BarangWithRelations => {
			const statusStok =
				b.stok === 0 ? 'habis' : b.stok <= b.stokMinimum ? 'menipis' : 'normal';
			return {
				...b,
				statusStok,
				kategori: $kategori.find((k) => k.id === b.kategoriId),
				supplier: $supplier.find((s) => s.id === b.supplierId)
			};
		})
);

// ========================
// Derived: Dashboard stats
// ========================
export const dashboardStats = derived(
	[barangStore, transaksiMasukStore, transaksiKeluarStore],
	([$barang, $masuk, $keluar]): DashboardStats => {
		const today = new Date().toISOString().split('T')[0];
		const transaksiHariIni =
			$masuk.filter((t) => t.tanggal === today).length +
			$keluar.filter((t) => t.tanggal === today).length;

		return {
			totalBarang: $barang.length,
			totalStok: $barang.reduce((s, b) => s + b.stok, 0),
			nilaiInventori: $barang.reduce((s, b) => s + b.stok * b.hargaBeli, 0),
			transaksiHariIni,
			stokMenipis: $barang.filter((b) => b.stok > 0 && b.stok <= b.stokMinimum).length,
			stokHabis: $barang.filter((b) => b.stok === 0).length
		};
	}
);
