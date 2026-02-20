import type {
	Kategori,
	Supplier,
	Barang,
	TransaksiMasuk,
	TransaksiKeluar,
	AppSettings
} from '$lib/types';

// =====================
// Seed Data - Kategori
// =====================
export const seedKategori: Kategori[] = [
	{
		id: 'kat-001',
		nama: 'Elektronik',
		deskripsi: 'Perangkat elektronik dan aksesoris',
		warna: '#3b82f6',
		icon: 'Cpu',
		createdAt: '2025-01-01T00:00:00Z'
	},
	{
		id: 'kat-002',
		nama: 'Peralatan Kantor',
		deskripsi: 'Perlengkapan dan peralatan kantor',
		warna: '#8b5cf6',
		icon: 'Briefcase',
		createdAt: '2025-01-01T00:00:00Z'
	},
	{
		id: 'kat-003',
		nama: 'Furniture',
		deskripsi: 'Meja, kursi, dan furnitur kantor',
		warna: '#f59e0b',
		icon: 'Armchair',
		createdAt: '2025-01-01T00:00:00Z'
	},
	{
		id: 'kat-004',
		nama: 'Alat Tulis',
		deskripsi: 'Pulpen, kertas, dan alat tulis kantor',
		warna: '#10b981',
		icon: 'Pen',
		createdAt: '2025-01-01T00:00:00Z'
	},
	{
		id: 'kat-005',
		nama: 'Komputer & Laptop',
		deskripsi: 'PC, laptop, dan periferal komputer',
		warna: '#ef4444',
		icon: 'Monitor',
		createdAt: '2025-01-01T00:00:00Z'
	},
	{
		id: 'kat-006',
		nama: 'Kebersihan',
		deskripsi: 'Produk kebersihan dan sanitasi',
		warna: '#06b6d4',
		icon: 'Sparkles',
		createdAt: '2025-01-01T00:00:00Z'
	}
];

// =====================
// Seed Data - Supplier
// =====================
export const seedSupplier: Supplier[] = [
	{
		id: 'sup-001',
		kode: 'SUP001',
		nama: 'PT. Teknologi Maju',
		kontak: '021-5551234',
		email: 'sales@tekno-maju.co.id',
		alamat: 'Jl. Sudirman No. 45',
		kota: 'Jakarta',
		status: 'aktif',
		createdAt: '2025-01-05T00:00:00Z'
	},
	{
		id: 'sup-002',
		kode: 'SUP002',
		nama: 'CV. Bersama Jaya',
		kontak: '022-7778888',
		email: 'order@bersamajaya.com',
		alamat: 'Jl. Asia Afrika No. 12',
		kota: 'Bandung',
		status: 'aktif',
		createdAt: '2025-01-10T00:00:00Z'
	},
	{
		id: 'sup-003',
		kode: 'SUP003',
		nama: 'Toko Sejahtera',
		kontak: '031-4445566',
		email: 'info@tokosejahtera.id',
		alamat: 'Ruko Darmo Permai No. 8',
		kota: 'Surabaya',
		status: 'aktif',
		createdAt: '2025-01-15T00:00:00Z'
	},
	{
		id: 'sup-004',
		kode: 'SUP004',
		nama: 'PT. Global Distribusi',
		kontak: '024-3334455',
		email: 'distribution@globaldist.co.id',
		alamat: 'Jl. MT. Haryono No. 67',
		kota: 'Semarang',
		status: 'aktif',
		createdAt: '2025-02-01T00:00:00Z'
	},
	{
		id: 'sup-005',
		kode: 'SUP005',
		nama: 'UD. Mitra Usaha',
		kontak: '0274-8889900',
		email: 'mitradist@gmail.com',
		alamat: 'Jl. Malioboro No. 99',
		kota: 'Yogyakarta',
		status: 'nonaktif',
		createdAt: '2025-02-10T00:00:00Z'
	},
	{
		id: 'sup-006',
		kode: 'SUP006',
		nama: 'PT. Prima Karya',
		kontak: '021-9990011',
		email: 'sales@primakarya.co.id',
		alamat: 'Jl. Gatot Subroto Kav. 23',
		kota: 'Jakarta',
		status: 'aktif',
		createdAt: '2025-02-15T00:00:00Z'
	}
];

// =====================
// Seed Data - Barang
// =====================
export const seedBarang: Barang[] = [
	{
		id: 'brg-001', kode: 'ELK-001', nama: 'Monitor LED 24"', deskripsi: 'Monitor LED Full HD 24 inci resolusi 1920x1080',
		kategoriId: 'kat-001', supplierId: 'sup-001', stok: 15, stokMinimum: 5,
		satuan: 'Unit', hargaBeli: 1850000, hargaJual: 2200000, lokasi: 'Rak A-1',
		createdAt: '2025-01-10T00:00:00Z', updatedAt: '2025-01-10T00:00:00Z'
	},
	{
		id: 'brg-002', kode: 'ELK-002', nama: 'Keyboard Wireless', deskripsi: 'Keyboard wireless bluetooth compact 80%',
		kategoriId: 'kat-001', supplierId: 'sup-001', stok: 30, stokMinimum: 10,
		satuan: 'Unit', hargaBeli: 280000, hargaJual: 380000, lokasi: 'Rak A-2',
		createdAt: '2025-01-10T00:00:00Z', updatedAt: '2025-01-10T00:00:00Z'
	},
	{
		id: 'brg-003', kode: 'ELK-003', nama: 'Mouse Wireless', deskripsi: 'Mouse wireless ergonomis dengan baterai AA',
		kategoriId: 'kat-001', supplierId: 'sup-001', stok: 25, stokMinimum: 10,
		satuan: 'Unit', hargaBeli: 150000, hargaJual: 220000, lokasi: 'Rak A-2',
		createdAt: '2025-01-11T00:00:00Z', updatedAt: '2025-01-11T00:00:00Z'
	},
	{
		id: 'brg-004', kode: 'KOM-001', nama: 'Laptop Core i5 Gen 12', deskripsi: 'Laptop bisnis Intel Core i5 Gen 12, RAM 8GB, SSD 512GB',
		kategoriId: 'kat-005', supplierId: 'sup-001', stok: 8, stokMinimum: 3,
		satuan: 'Unit', hargaBeli: 7500000, hargaJual: 9500000, lokasi: 'Rak B-1',
		createdAt: '2025-01-12T00:00:00Z', updatedAt: '2025-01-12T00:00:00Z'
	},
	{
		id: 'brg-005', kode: 'KOM-002', nama: 'PC Desktop All-in-One', deskripsi: 'PC AIO Intel Core i3, RAM 4GB, HDD 1TB, layar 21.5"',
		kategoriId: 'kat-005', supplierId: 'sup-001', stok: 4, stokMinimum: 2,
		satuan: 'Unit', hargaBeli: 5200000, hargaJual: 6800000, lokasi: 'Rak B-2',
		createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z'
	},
	{
		id: 'brg-006', kode: 'PKN-001', nama: 'Printer Laser Monochrome', deskripsi: 'Printer laser hitam putih kecepatan 25ppm',
		kategoriId: 'kat-002', supplierId: 'sup-002', stok: 6, stokMinimum: 2,
		satuan: 'Unit', hargaBeli: 1200000, hargaJual: 1650000, lokasi: 'Rak C-1',
		createdAt: '2025-01-16T00:00:00Z', updatedAt: '2025-01-16T00:00:00Z'
	},
	{
		id: 'brg-007', kode: 'PKN-002', nama: 'Mesin Fotokopi A3', deskripsi: 'Mesin fotokopi multifungsi A3, 30ppm, duplex',
		kategoriId: 'kat-002', supplierId: 'sup-002', stok: 2, stokMinimum: 1,
		satuan: 'Unit', hargaBeli: 15000000, hargaJual: 19500000, lokasi: 'Rak C-2',
		createdAt: '2025-01-17T00:00:00Z', updatedAt: '2025-01-17T00:00:00Z'
	},
	{
		id: 'brg-008', kode: 'PKN-003', nama: 'Proyektor LED 3500 Lumens', deskripsi: 'Proyektor LED resolusi FullHD, 3500 lumens, koneksi HDMI/WiFi',
		kategoriId: 'kat-002', supplierId: 'sup-004', stok: 3, stokMinimum: 2,
		satuan: 'Unit', hargaBeli: 3800000, hargaJual: 5200000, lokasi: 'Rak C-3',
		createdAt: '2025-01-18T00:00:00Z', updatedAt: '2025-01-18T00:00:00Z'
	},
	{
		id: 'brg-009', kode: 'FRN-001', nama: 'Kursi Ergonomis Kantor', deskripsi: 'Kursi ergonomis dengan sandaran punggung adjustable, mesh',
		kategoriId: 'kat-003', supplierId: 'sup-003', stok: 20, stokMinimum: 5,
		satuan: 'Unit', hargaBeli: 750000, hargaJual: 1100000, lokasi: 'Gudang D-1',
		createdAt: '2025-01-20T00:00:00Z', updatedAt: '2025-01-20T00:00:00Z'
	},
	{
		id: 'brg-010', kode: 'FRN-002', nama: 'Meja Kerja L-Shape', deskripsi: 'Meja kerja bentuk L kayu MDF, ukuran 160x120cm',
		kategoriId: 'kat-003', supplierId: 'sup-003', stok: 10, stokMinimum: 3,
		satuan: 'Unit', hargaBeli: 1200000, hargaJual: 1700000, lokasi: 'Gudang D-2',
		createdAt: '2025-01-21T00:00:00Z', updatedAt: '2025-01-21T00:00:00Z'
	},
	{
		id: 'brg-011', kode: 'FRN-003', nama: 'Lemari Arsip 4 Laci', deskripsi: 'Lemari arsip besi 4 laci, kunci, finishing powder coat',
		kategoriId: 'kat-003', supplierId: 'sup-003', stok: 12, stokMinimum: 3,
		satuan: 'Unit', hargaBeli: 950000, hargaJual: 1300000, lokasi: 'Gudang D-3',
		createdAt: '2025-01-22T00:00:00Z', updatedAt: '2025-01-22T00:00:00Z'
	},
	{
		id: 'brg-012', kode: 'ATK-001', nama: 'Kertas A4 80gsm', deskripsi: 'Kertas HVS A4 80gsm, 1 rim = 500 lembar',
		kategoriId: 'kat-004', supplierId: 'sup-002', stok: 200, stokMinimum: 50,
		satuan: 'Rim', hargaBeli: 45000, hargaJual: 62000, lokasi: 'Rak E-1',
		createdAt: '2025-01-25T00:00:00Z', updatedAt: '2025-01-25T00:00:00Z'
	},
	{
		id: 'brg-013', kode: 'ATK-002', nama: 'Pulpen Ballpoint (Box)', deskripsi: 'Pulpen ballpoint tinta hitam, isi 50 pcs per box',
		kategoriId: 'kat-004', supplierId: 'sup-002', stok: 45, stokMinimum: 15,
		satuan: 'Box', hargaBeli: 28000, hargaJual: 42000, lokasi: 'Rak E-2',
		createdAt: '2025-01-25T00:00:00Z', updatedAt: '2025-01-25T00:00:00Z'
	},
	{
		id: 'brg-014', kode: 'ATK-003', nama: 'Stapler Besar', deskripsi: 'Stapler heavy duty kapasitas 50 lembar',
		kategoriId: 'kat-004', supplierId: 'sup-002', stok: 3, stokMinimum: 5,
		satuan: 'Unit', hargaBeli: 55000, hargaJual: 85000, lokasi: 'Rak E-3',
		createdAt: '2025-01-26T00:00:00Z', updatedAt: '2025-01-26T00:00:00Z'
	},
	{
		id: 'brg-015', kode: 'ATK-004', nama: 'Whiteboard 120x80cm', deskripsi: 'Papan tulis whiteboard magnetic, frame aluminium',
		kategoriId: 'kat-004', supplierId: 'sup-003', stok: 7, stokMinimum: 3,
		satuan: 'Unit', hargaBeli: 350000, hargaJual: 520000, lokasi: 'Rak E-4',
		createdAt: '2025-01-27T00:00:00Z', updatedAt: '2025-01-27T00:00:00Z'
	},
	{
		id: 'brg-016', kode: 'KBR-001', nama: 'Sabun Tangan Cair 5L', deskripsi: 'Sabun cuci tangan antibakteri kemasan galon 5 liter',
		kategoriId: 'kat-006', supplierId: 'sup-006', stok: 30, stokMinimum: 10,
		satuan: 'Galon', hargaBeli: 65000, hargaJual: 90000, lokasi: 'Rak F-1',
		createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-02-01T00:00:00Z'
	},
	{
		id: 'brg-017', kode: 'KBR-002', nama: 'Hand Sanitizer 500ml', deskripsi: 'Hand sanitizer gel 70% alkohol, pump bottle 500ml',
		kategoriId: 'kat-006', supplierId: 'sup-006', stok: 0, stokMinimum: 20,
		satuan: 'Botol', hargaBeli: 32000, hargaJual: 45000, lokasi: 'Rak F-2',
		createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-02-01T00:00:00Z'
	},
	{
		id: 'brg-018', kode: 'ELK-004', nama: 'UPS 1200VA', deskripsi: 'UPS online 1200VA 720W, waktu backup 10-15 menit',
		kategoriId: 'kat-001', supplierId: 'sup-004', stok: 9, stokMinimum: 3,
		satuan: 'Unit', hargaBeli: 850000, hargaJual: 1150000, lokasi: 'Rak A-3',
		createdAt: '2025-02-05T00:00:00Z', updatedAt: '2025-02-05T00:00:00Z'
	},
	{
		id: 'brg-019', kode: 'ELK-005', nama: 'Kabel HDMI 2m', deskripsi: 'Kabel HDMI v2.0 panjang 2 meter, 4K support',
		kategoriId: 'kat-001', supplierId: 'sup-004', stok: 50, stokMinimum: 15,
		satuan: 'Pcs', hargaBeli: 35000, hargaJual: 55000, lokasi: 'Rak A-4',
		createdAt: '2025-02-05T00:00:00Z', updatedAt: '2025-02-05T00:00:00Z'
	},
	{
		id: 'brg-020', kode: 'ATK-005', nama: 'Tinta Printer Hitam', deskripsi: 'Tinta printer compatible, warna hitam 100ml',
		kategoriId: 'kat-004', supplierId: 'sup-002', stok: 4, stokMinimum: 10,
		satuan: 'Botol', hargaBeli: 28000, hargaJual: 45000, lokasi: 'Rak E-5',
		createdAt: '2025-02-08T00:00:00Z', updatedAt: '2025-02-08T00:00:00Z'
	}
];

// =====================
// Seed Data - Transaksi Masuk
// =====================
const today = new Date();
const daysAgo = (n: number) => {
	const d = new Date(today);
	d.setDate(d.getDate() - n);
	return d.toISOString().split('T')[0];
};

export const seedTransaksiMasuk: TransaksiMasuk[] = [
	{
		id: 'tm-001', noFaktur: 'INV/2025/01/001', barangId: 'brg-001', supplierId: 'sup-001',
		jumlah: 10, hargaSatuan: 1850000, totalHarga: 18500000,
		tanggal: daysAgo(45), catatan: 'Pembelian awal stok', createdAt: daysAgo(45)
	},
	{
		id: 'tm-002', noFaktur: 'INV/2025/01/002', barangId: 'brg-004', supplierId: 'sup-001',
		jumlah: 5, hargaSatuan: 7500000, totalHarga: 37500000,
		tanggal: daysAgo(42), catatan: 'Laptop untuk divisi IT', createdAt: daysAgo(42)
	},
	{
		id: 'tm-003', noFaktur: 'INV/2025/01/003', barangId: 'brg-012', supplierId: 'sup-002',
		jumlah: 100, hargaSatuan: 45000, totalHarga: 4500000,
		tanggal: daysAgo(40), catatan: 'Kertas bulanan', createdAt: daysAgo(40)
	},
	{
		id: 'tm-004', noFaktur: 'INV/2025/01/004', barangId: 'brg-009', supplierId: 'sup-003',
		jumlah: 15, hargaSatuan: 750000, totalHarga: 11250000,
		tanggal: daysAgo(38), catatan: 'Kursi untuk ruang meeting baru', createdAt: daysAgo(38)
	},
	{
		id: 'tm-005', noFaktur: 'INV/2025/01/005', barangId: 'brg-013', supplierId: 'sup-002',
		jumlah: 30, hargaSatuan: 28000, totalHarga: 840000,
		tanggal: daysAgo(35), catatan: '', createdAt: daysAgo(35)
	},
	{
		id: 'tm-006', noFaktur: 'INV/2025/02/001', barangId: 'brg-002', supplierId: 'sup-001',
		jumlah: 20, hargaSatuan: 280000, totalHarga: 5600000,
		tanggal: daysAgo(30), catatan: 'Restock keyboard', createdAt: daysAgo(30)
	},
	{
		id: 'tm-007', noFaktur: 'INV/2025/02/002', barangId: 'brg-016', supplierId: 'sup-006',
		jumlah: 20, hargaSatuan: 65000, totalHarga: 1300000,
		tanggal: daysAgo(25), catatan: 'Kebersihan bulanan', createdAt: daysAgo(25)
	},
	{
		id: 'tm-008', noFaktur: 'INV/2025/02/003', barangId: 'brg-019', supplierId: 'sup-004',
		jumlah: 30, hargaSatuan: 35000, totalHarga: 1050000,
		tanggal: daysAgo(22), catatan: 'Kabel aksesoris', createdAt: daysAgo(22)
	},
	{
		id: 'tm-009', noFaktur: 'INV/2025/02/004', barangId: 'brg-018', supplierId: 'sup-004',
		jumlah: 5, hargaSatuan: 850000, totalHarga: 4250000,
		tanggal: daysAgo(18), catatan: 'UPS backup server', createdAt: daysAgo(18)
	},
	{
		id: 'tm-010', noFaktur: 'INV/2025/02/005', barangId: 'brg-010', supplierId: 'sup-003',
		jumlah: 8, hargaSatuan: 1200000, totalHarga: 9600000,
		tanggal: daysAgo(15), catatan: 'Renovasi ruangan', createdAt: daysAgo(15)
	},
	{
		id: 'tm-011', noFaktur: 'INV/2025/02/006', barangId: 'brg-003', supplierId: 'sup-001',
		jumlah: 15, hargaSatuan: 150000, totalHarga: 2250000,
		tanggal: daysAgo(12), catatan: 'Mouse restock', createdAt: daysAgo(12)
	},
	{
		id: 'tm-012', noFaktur: 'INV/2025/02/007', barangId: 'brg-017', supplierId: 'sup-006',
		jumlah: 10, hargaSatuan: 32000, totalHarga: 320000,
		tanggal: daysAgo(8), catatan: 'Sanitizer habis', createdAt: daysAgo(8)
	},
	{
		id: 'tm-013', noFaktur: 'INV/2025/02/008', barangId: 'brg-012', supplierId: 'sup-002',
		jumlah: 50, hargaSatuan: 45000, totalHarga: 2250000,
		tanggal: daysAgo(5), catatan: 'Restock kertas', createdAt: daysAgo(5)
	},
	{
		id: 'tm-014', noFaktur: 'INV/2025/02/009', barangId: 'brg-020', supplierId: 'sup-002',
		jumlah: 8, hargaSatuan: 28000, totalHarga: 224000,
		tanggal: daysAgo(3), catatan: 'Tinta printer', createdAt: daysAgo(3)
	},
	{
		id: 'tm-015', noFaktur: 'INV/2025/02/010', barangId: 'brg-006', supplierId: 'sup-002',
		jumlah: 3, hargaSatuan: 1200000, totalHarga: 3600000,
		tanggal: daysAgo(1), catatan: 'Printer divisi keuangan', createdAt: daysAgo(1)
	}
];

// =====================
// Seed Data - Transaksi Keluar
// =====================
export const seedTransaksiKeluar: TransaksiKeluar[] = [
	{
		id: 'tk-001', noReferensi: 'OUT/2025/01/001', barangId: 'brg-009',
		jumlah: 5, tujuan: 'Divisi HR', alasan: 'Penggunaan internal',
		tanggal: daysAgo(43), catatan: 'Kursi cadangan HR', createdAt: daysAgo(43)
	},
	{
		id: 'tk-002', noReferensi: 'OUT/2025/01/002', barangId: 'brg-012',
		jumlah: 20, tujuan: 'Divisi Finance', alasan: 'Penggunaan rutin',
		tanggal: daysAgo(40), catatan: '', createdAt: daysAgo(40)
	},
	{
		id: 'tk-003', noReferensi: 'OUT/2025/01/003', barangId: 'brg-002',
		jumlah: 5, tujuan: 'Divisi IT', alasan: 'Penggantian rusak',
		tanggal: daysAgo(38), catatan: 'Keyboard lama rusak', createdAt: daysAgo(38)
	},
	{
		id: 'tk-004', noReferensi: 'OUT/2025/01/004', barangId: 'brg-013',
		jumlah: 10, tujuan: 'Semua divisi', alasan: 'Penggunaan rutin',
		tanggal: daysAgo(35), catatan: '', createdAt: daysAgo(35)
	},
	{
		id: 'tk-005', noReferensi: 'OUT/2025/01/005', barangId: 'brg-001',
		jumlah: 3, tujuan: 'Divisi Marketing', alasan: 'Setup workstation baru',
		tanggal: daysAgo(30), catatan: 'Setup 3 workstation baru', createdAt: daysAgo(30)
	},
	{
		id: 'tk-006', noReferensi: 'OUT/2025/02/001', barangId: 'brg-016',
		jumlah: 5, tujuan: 'Seluruh lantai', alasan: 'Penggunaan bulanan',
		tanggal: daysAgo(28), catatan: '', createdAt: daysAgo(28)
	},
	{
		id: 'tk-007', noReferensi: 'OUT/2025/02/002', barangId: 'brg-004',
		jumlah: 2, tujuan: 'Divisi Sales', alasan: 'Laptop baru karyawan',
		tanggal: daysAgo(25), catatan: 'Karyawan baru sales', createdAt: daysAgo(25)
	},
	{
		id: 'tk-008', noReferensi: 'OUT/2025/02/003', barangId: 'brg-019',
		jumlah: 10, tujuan: 'IT Dept', alasan: 'Setup jaringan',
		tanggal: daysAgo(20), catatan: '', createdAt: daysAgo(20)
	},
	{
		id: 'tk-009', noReferensi: 'OUT/2025/02/004', barangId: 'brg-012',
		jumlah: 30, tujuan: 'Divisi Finance & Marketing', alasan: 'Penggunaan rutin',
		tanggal: daysAgo(15), catatan: '', createdAt: daysAgo(15)
	},
	{
		id: 'tk-010', noReferensi: 'OUT/2025/02/005', barangId: 'brg-017',
		jumlah: 10, tujuan: 'Seluruh lantai', alasan: 'Habis pakai',
		tanggal: daysAgo(10), catatan: 'Stok habis', createdAt: daysAgo(10)
	},
	{
		id: 'tk-011', noReferensi: 'OUT/2025/02/006', barangId: 'brg-010',
		jumlah: 2, tujuan: 'Ruang Meeting Lantai 3', alasan: 'Renovasi',
		tanggal: daysAgo(8), catatan: '', createdAt: daysAgo(8)
	},
	{
		id: 'tk-012', noReferensi: 'OUT/2025/02/007', barangId: 'brg-013',
		jumlah: 5, tujuan: 'Divisi Admin', alasan: 'Penggunaan rutin',
		tanggal: daysAgo(5), catatan: '', createdAt: daysAgo(5)
	},
	{
		id: 'tk-013', noReferensi: 'OUT/2025/02/008', barangId: 'brg-006',
		jumlah: 1, tujuan: 'Divisi HRD', alasan: 'Printer lama rusak',
		tanggal: daysAgo(3), catatan: 'Penggantian printer HRD', createdAt: daysAgo(3)
	},
	{
		id: 'tk-014', noReferensi: 'OUT/2025/02/009', barangId: 'brg-020',
		jumlah: 4, tujuan: 'IT Support', alasan: 'Habis pakai',
		tanggal: daysAgo(2), catatan: 'Tinta untuk maintenance', createdAt: daysAgo(2)
	},
	{
		id: 'tk-015', noReferensi: 'OUT/2025/02/010', barangId: 'brg-003',
		jumlah: 3, tujuan: 'Ruang Training', alasan: 'Kelengkapan pelatihan',
		tanggal: daysAgo(1), catatan: '', createdAt: daysAgo(1)
	}
];

// =====================
// Seed Data - Settings
// =====================
export const seedSettings: AppSettings = {
	namaPerusahaan: 'PT. Nusantara Teknologi',
	alamatPerusahaan: 'Jl. Jenderal Sudirman Kav. 52-53, Jakarta Selatan 12190',
	teleponPerusahaan: '021-5551234',
	emailPerusahaan: 'info@nusantara-teknologi.co.id',
	stokMinimumDefault: 5,
	darkMode: false,
	matauang: 'IDR'
};
