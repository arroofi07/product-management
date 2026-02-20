// =====================
// Core Entity Types
// =====================

export interface Kategori {
	id: string;
	nama: string;
	deskripsi: string;
	warna: string; // hex color
	icon: string; // lucide icon name
	createdAt: string;
}

export interface Supplier {
	id: string;
	kode: string;
	nama: string;
	kontak: string;
	email: string;
	alamat: string;
	kota: string;
	status: 'aktif' | 'nonaktif';
	createdAt: string;
}

export interface Barang {
	id: string;
	kode: string; // SKU
	nama: string;
	deskripsi: string;
	kategoriId: string;
	supplierId: string;
	stok: number;
	stokMinimum: number;
	satuan: string;
	hargaBeli: number;
	hargaJual: number;
	lokasi: string; // Rak/lokasi penyimpanan
	gambar?: string;
	createdAt: string;
	updatedAt: string;
}

export interface TransaksiMasuk {
	id: string;
	noFaktur: string;
	barangId: string;
	supplierId: string;
	jumlah: number;
	hargaSatuan: number;
	totalHarga: number;
	tanggal: string;
	catatan: string;
	createdAt: string;
}

export interface TransaksiKeluar {
	id: string;
	noReferensi: string;
	barangId: string;
	jumlah: number;
	tujuan: string;
	alasan: string;
	tanggal: string;
	catatan: string;
	createdAt: string;
}

export interface AppSettings {
	namaPerusahaan: string;
	alamatPerusahaan: string;
	teleponPerusahaan: string;
	emailPerusahaan: string;
	stokMinimumDefault: number;
	darkMode: boolean;
	matauang: string;
}

// =====================
// Derived / View Types
// =====================

export interface BarangWithRelations extends Barang {
	kategori?: Kategori;
	supplier?: Supplier;
	statusStok: 'normal' | 'menipis' | 'habis';
}

export interface TransaksiMasukWithRelations extends TransaksiMasuk {
	barang?: Barang;
	supplier?: Supplier;
}

export interface TransaksiKeluarWithRelations extends TransaksiKeluar {
	barang?: Barang;
}

export interface DashboardStats {
	totalBarang: number;
	totalStok: number;
	nilaiInventori: number;
	transaksiHariIni: number;
	stokMenipis: number;
	stokHabis: number;
}

export interface KategoriStat extends Kategori {
	jumlahBarang: number;
	totalStok: number;
	nilaiInventori: number;
}

// =====================
// Form Types
// =====================

export type BarangForm = Omit<Barang, 'id' | 'createdAt' | 'updatedAt'>;
export type KategoriForm = Omit<Kategori, 'id' | 'createdAt'>;
export type SupplierForm = Omit<Supplier, 'id' | 'createdAt'>;
export type TransaksiMasukForm = Omit<TransaksiMasuk, 'id' | 'totalHarga' | 'createdAt'>;
export type TransaksiKeluarForm = Omit<TransaksiKeluar, 'id' | 'createdAt'>;
