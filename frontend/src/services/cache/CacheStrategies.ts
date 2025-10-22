/**
 * WF-COMP-XXX | CacheStrategies.ts - Caching strategies
 * Purpose: Different caching strategies for various use cases
 * Dependencies: ApiCache
 * Last Updated: 2025-10-22 | File Type: .ts
 */

import { ApiCache } from './ApiCache';

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export enum CacheStrategy {
  CACHE_FIRST = 'CACHE_FIRST',
  NETWORK_FIRST = 'NETWORK_FIRST',
  CACHE_ONLY = 'CACHE_ONLY',
  NETWORK_ONLY = 'NETWORK_ONLY',
  STALE_WHILE_REVALIDATE = 'STALE_WHILE_REVALIDATE',
}

interface CacheOptions {
  ttl?: number;
  tags?: string[];
  key?: string;
}

// ==========================================
// CACHE STRATEGY IMPLEMENTATIONS
// ==========================================

/**
 * Cache-first strategy: Return cached data if available, otherwise fetch
 */
export async function cacheFirst<T>(
  cache: ApiCache,
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cached = cache.get<T>(key);
  
  if (cached !== null) {
    return cached;
  }
  
  const data = await fetcher();
  cache.set(key, data, options.ttl, options.tags);
  
  return data;
}

/**
 * Network-first strategy: Always fetch, fallback to cache on error
 */
export async function networkFirst<T>(
  cache: ApiCache,
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  try {
    const data = await fetcher();
    cache.set(key, data, options.ttl, options.tags);
    return data;
  } catch (error) {
    const cached = cache.get<T>(key);
    
    if (cached !== null) {
      console.warn('[CacheStrategies] Network request failed, using cached data');
      return cached;
    }
    
    throw error;
  }
}

/**
 * Cache-only strategy: Only return cached data, never fetch
 */
export async function cacheOnly<T>(
  cache: ApiCache,
  key: string
): Promise<T | null> {
  return cache.get<T>(key);
}

/**
 * Network-only strategy: Always fetch, never use cache
 */
export async function networkOnly<T>(
  cache: ApiCache,
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const data = await fetcher();
  cache.set(key, data, options.ttl, options.tags);
  return data;
}

/**
 * Stale-while-revalidate strategy: Return cached data immediately, update in background
 */
export async function staleWhileRevalidate<T>(
  cache: ApiCache,
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const cached = cache.get<T>(key);
  
  // Start background update
  fetcher()
    .then(data => {
      cache.set(key, data, options.ttl, options.tags);
    })
    .catch(error => {
      console.error('[CacheStrategies] Background update failed:', error);
    });
  
  // Return cached data immediately if available
  if (cached !== null) {
    return cached;
  }
  
  // If no cached data, wait for fetch
  return fetcher();
}

// ==========================================
// CACHE STRATEGY FACTORY
// ==========================================

/**
 * Create a cache function with specific strategy
 */
export function createCacheStrategy(
  cache: ApiCache,
  strategy: CacheStrategy
) {
  return async <T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T | null> => {
    switch (strategy) {
      case CacheStrategy.CACHE_FIRST:
        return cacheFirst(cache, key, fetcher, options);
        
      case CacheStrategy.NETWORK_FIRST:
        return networkFirst(cache, key, fetcher, options);
        
      case CacheStrategy.CACHE_ONLY:
        return cacheOnly(cache, key);
        
      case CacheStrategy.NETWORK_ONLY:
        return networkOnly(cache, key, fetcher, options);
        
      case CacheStrategy.STALE_WHILE_REVALIDATE:
        return staleWhileRevalidate(cache, key, fetcher, options);
        
      default:
        return cacheFirst(cache, key, fetcher, options);
    }
  };
}

// ==========================================
// CACHE INVALIDATION
// ==========================================

/**
 * Invalidate cache on mutation
 */
export function invalidateOnMutation(
  cache: ApiCache,
  tags: string[]
): void {
  tags.forEach(tag => cache.clearByTag(tag));
}

/**
 * Invalidate related caches
 */
export function invalidateRelated(
  cache: ApiCache,
  resource: string,
  action: 'create' | 'update' | 'delete'
): void {
  // Invalidate list caches
  cache.clearByTag(`${resource}-list`);
  
  // Invalidate detail caches on delete
  if (action === 'delete') {
    cache.clearByTag(`${resource}-detail`);
  }
  
  // Invalidate related resources
  // Example: updating a patient should invalidate appointments
  const relatedResources: Record<string, string[]> = {
    patient: ['appointment', 'medical-record', 'prescription'],
    client: ['appointment', 'invoice', 'patient'],
    appointment: ['patient', 'client', 'staff'],
  };
  
  const related = relatedResources[resource] || [];
  related.forEach(relatedResource => {
    cache.clearByTag(`${relatedResource}-list`);
  });
}

// ==========================================
// CACHE KEY BUILDERS
// ==========================================

/**
 * Build cache key for list endpoint
 */
export function buildListCacheKey(
  resource: string,
  filters?: Record<string, unknown>
): string {
  const baseKey = `${resource}-list`;
  
  if (!filters || Object.keys(filters).length === 0) {
    return baseKey;
  }
  
  const sortedFilters = Object.keys(filters)
    .sort()
    .map(key => `${key}=${JSON.stringify(filters[key])}`)
    .join('&');
  
  return `${baseKey}?${sortedFilters}`;
}

/**
 * Build cache key for detail endpoint
 */
export function buildDetailCacheKey(
  resource: string,
  id: string
): string {
  return `${resource}-detail-${id}`;
}

/**
 * Build cache key for custom endpoint
 */
export function buildCustomCacheKey(
  resource: string,
  endpoint: string,
  params?: Record<string, unknown>
): string {
  const baseKey = `${resource}-${endpoint}`;
  
  if (!params || Object.keys(params).length === 0) {
    return baseKey;
  }
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${JSON.stringify(params[key])}`)
    .join('&');
  
  return `${baseKey}?${sortedParams}`;
}
