/**
 * WF-COMP-XXX | ApiCache.ts - Response caching
 * Purpose: Cache API responses to reduce network requests
 * Dependencies: none
 * Last Updated: 2025-10-22 | File Type: .ts
 */

// ==========================================
// TYPE DEFINITIONS
// ==========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
}

interface CacheConfig {
  defaultTtl?: number;
  maxSize?: number;
}

interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: number;
}

// ==========================================
// API CACHE CLASS
// ==========================================

export class ApiCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTtl: number;
  private maxSize: number;
  private hits = 0;
  private misses = 0;

  constructor(config: CacheConfig = {}) {
    this.defaultTtl = config.defaultTtl || 300000; // 5 minutes
    this.maxSize = config.maxSize || 100;
  }

  /**
   * Set cache entry
   */
  set<T>(key: string, data: T, ttl?: number, tags: string[] = []): void {
    // Evict oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = Array.from(this.cache.keys())[0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTtl,
      tags,
    });
  }

  /**
   * Get cache entry
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      this.misses++;
      return null;
    }

    // Check if entry is expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return entry.data;
  }

  /**
   * Check if cache has key
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) return false;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Delete cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Clear cache entries by tag
   */
  clearByTag(tag: string): void {
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (entry.tags.includes(tag)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
    };
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const apiCache = new ApiCache();
export default apiCache;
