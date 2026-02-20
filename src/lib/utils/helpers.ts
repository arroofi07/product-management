/**
 * Utility helpers
 */

export function formatRupiah(amount: number): string {
	return new Intl.NumberFormat('id-ID', {
		style: 'currency',
		currency: 'IDR',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(amount);
}

export function formatNumber(n: number): string {
	return new Intl.NumberFormat('id-ID').format(n);
}

export function formatDate(dateStr: string): string {
	if (!dateStr) return '-';
	const d = new Date(dateStr);
	return new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).format(d);
}

export function formatDateShort(dateStr: string): string {
	if (!dateStr) return '-';
	const d = new Date(dateStr);
	return new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	}).format(d);
}

export function formatDateTime(dateStr: string): string {
	if (!dateStr) return '-';
	const d = new Date(dateStr);
	return new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}).format(d);
}

export function formatRelativeTime(dateStr: string): string {
	const d = new Date(dateStr);
	const now = new Date();
	const diff = now.getTime() - d.getTime();
	const days = Math.floor(diff / 86400000);
	const hours = Math.floor(diff / 3600000);
	const minutes = Math.floor(diff / 60000);

	if (days > 30) return formatDateShort(dateStr);
	if (days > 0) return `${days} hari lalu`;
	if (hours > 0) return `${hours} jam lalu`;
	if (minutes > 0) return `${minutes} menit lalu`;
	return 'Baru saja';
}

export function generateNoFaktur(): string {
	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const rand = Math.floor(Math.random() * 9000) + 1000;
	return `INV/${y}/${m}/${rand}`;
}

export function generateNoReferensi(): string {
	const now = new Date();
	const y = now.getFullYear();
	const m = String(now.getMonth() + 1).padStart(2, '0');
	const rand = Math.floor(Math.random() * 9000) + 1000;
	return `OUT/${y}/${m}/${rand}`;
}

export function getStatusStokLabel(status: string): string {
	switch (status) {
		case 'normal': return 'Normal';
		case 'menipis': return 'Stok Menipis';
		case 'habis': return 'Stok Habis';
		default: return status;
	}
}

export function getStatusStokColor(status: string): string {
	switch (status) {
		case 'normal': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
		case 'menipis': return 'text-amber-600 bg-amber-50 border-amber-200';
		case 'habis': return 'text-red-600 bg-red-50 border-red-200';
		default: return 'text-gray-600 bg-gray-50 border-gray-200';
	}
}

export function truncate(str: string, len = 40): string {
	if (!str) return '';
	return str.length > len ? str.slice(0, len) + '…' : str;
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay = 300) {
	let t: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(t);
		t = setTimeout(() => fn(...args), delay);
	};
}
