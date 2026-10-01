import { backend } from '$lib/client';
import { cacheGetJson, cacheSetJson } from '$lib/cache';
import { thumbPath } from '$lib/image';
import type { DownloadedGalleryItem, GalleryDetail, GalleryListItem, HistoryEntry } from '$lib/types';

const FAV_KEY = 'favorites:v1';
const HIST_KEY = 'history:v1';
const MAX_HISTORY = 200;

let favorites = $state<Map<number, GalleryListItem>>(new Map());
let history = $state<HistoryEntry[]>([]);
let downloaded = $state<DownloadedGalleryItem[]>([]);
let downloadedIds = $derived(new Set(downloaded.map((d) => d.id)));
const blobUrls = new Map<string, string>();

export function toGalleryListItem(g: GalleryDetail): GalleryListItem {
	return {
		id: g.id,
		media_id: g.media_id,
		english_title: g.title.english,
		japanese_title: g.title.japanese,
		thumbnail: thumbPath(g.thumbnail.path),
		thumbnail_width: g.thumbnail.width,
		thumbnail_height: g.thumbnail.height,
		num_pages: g.num_pages,
		num_favorites: g.num_favorites,
		tag_ids: g.tags.map((t) => t.id),
		blacklisted: null,
	};
}

function persistFavorites(): void {
	cacheSetJson(FAV_KEY, [...favorites.values()]);
}

function persistHistory(): void {
	cacheSetJson(HIST_KEY, history);
}

export async function loadDownloaded(): Promise<DownloadedGalleryItem[]> {
	try {
		const list = await backend.getDownloadedGalleries();
		downloaded = list;
		return list;
	} catch {
		return [];
	}
}

export async function loadLibrary(): Promise<void> {
	const fav = await cacheGetJson<GalleryListItem[]>(FAV_KEY);
	if (fav) favorites = new Map(fav.map((g) => [g.id, g]));
	const hist = await cacheGetJson<HistoryEntry[]>(HIST_KEY);
	if (hist) history = hist;
	await loadDownloaded();
}

export function getDownloaded(): DownloadedGalleryItem[] {
	return downloaded;
}

export function isDownloaded(id: number): boolean {
	return downloadedIds.has(id);
}

export async function deleteDownloaded(id: number): Promise<void> {
	await backend.deleteDownloadedGallery(id);
	downloaded = downloaded.filter((d) => d.id !== id);
}

export async function getDownloadedPageBlobUrl(id: number, pageIndex: number): Promise<string> {
	const key = `${id}:${pageIndex}`;
	const existing = blobUrls.get(key);
	if (existing) return existing;
	const bytes = await backend.getDownloadedGalleryPage(id, pageIndex);
	const blob = new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' });
	const url = URL.createObjectURL(blob);
	blobUrls.set(key, url);
	return url;
}

export function getFavorites(): GalleryListItem[] {
	return [...favorites.values()];
}

export function isFavorite(id: number): boolean {
	return favorites.has(id);
}

export function toggleFavorite(g: GalleryListItem): void {
	if (favorites.has(g.id)) {
		favorites.delete(g.id);
	} else {
		favorites.set(g.id, g);
	}
	persistFavorites();
}

export function removeFavorite(id: number): void {
	if (favorites.delete(id)) persistFavorites();
}

export function clearFavorites(): void {
	favorites = new Map();
	persistFavorites();
}

export function exportFavoritesData(): { version: number; favorites: GalleryListItem[] } {
	return {
		version: 1,
		favorites: [...favorites.values()],
	};
}

export function importFavoritesData(data: unknown): number {
	const list: GalleryListItem[] = Array.isArray(data)
		? data
		: data && typeof data === 'object' && 'favorites' in data && Array.isArray((data as { favorites: unknown[] }).favorites)
			? (data as { favorites: GalleryListItem[] }).favorites
			: [];
	let count = 0;
	for (const item of list) {
		if (item && typeof item.id === 'number') {
			favorites.set(item.id, item);
			count++;
		}
	}
	if (count > 0) persistFavorites();
	return count;
}

export function getHistory(): HistoryEntry[] {
	return history;
}

export function addToHistory(entry: HistoryEntry): void {
	const next = history.filter((h) => h.galleryId !== entry.galleryId);
	next.unshift(entry);
	history = next.slice(0, MAX_HISTORY);
	persistHistory();
}

export function clearHistory(): void {
	history = [];
	persistHistory();
}