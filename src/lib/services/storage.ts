/**
 * Generic localStorage service
 * Handles serialization, deserialization, and error handling
 */

const PREFIX = 'manajemen_barang_';

export const storage = {
	get<T>(key: string): T | null {
		if (typeof window === 'undefined') return null;
		try {
			const raw = localStorage.getItem(PREFIX + key);
			if (!raw) return null;
			return JSON.parse(raw) as T;
		} catch {
			console.warn(`[storage] Failed to parse key: ${key}`);
			return null;
		}
	},

	set<T>(key: string, value: T): void {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem(PREFIX + key, JSON.stringify(value));
		} catch {
			console.warn(`[storage] Failed to set key: ${key}`);
		}
	},

	remove(key: string): void {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(PREFIX + key);
	},

	clear(): void {
		if (typeof window === 'undefined') return;
		Object.keys(localStorage)
			.filter((k) => k.startsWith(PREFIX))
			.forEach((k) => localStorage.removeItem(k));
	},

	has(key: string): boolean {
		if (typeof window === 'undefined') return false;
		return localStorage.getItem(PREFIX + key) !== null;
	}
};

export default storage;
