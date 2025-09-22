import type { SnapkitConfig } from './types';
import { SnapkitUrlBuilder } from './url-builder';

/**
 * Factory pattern for caching and reusing SnapkitUrlBuilder instances
 * Prevents creating new instances for the same configuration
 */
export class UrlBuilderFactory {
  private static instances = new Map<string, SnapkitUrlBuilder>();

  /**
   * Get or create a SnapkitUrlBuilder instance for the given configuration
   * @param config - Snapkit configuration
   * @returns Cached or new SnapkitUrlBuilder instance
   */
  static getInstance(config: SnapkitConfig): SnapkitUrlBuilder {
    const key = this.createKey(config);

    if (!this.instances.has(key)) {
      // SnapkitUrlBuilder only accepts organizationName in constructor
      // Quality and format are handled at the transform level
      const builder = new SnapkitUrlBuilder(config.organizationName);
      this.instances.set(key, builder);
    }

    return this.instances.get(key)!;
  }

  /**
   * Clear all cached instances (useful for testing)
   */
  static clearCache(): void {
    this.instances.clear();
  }

  /**
   * Create a unique key for the configuration
   * @param config - Snapkit configuration
   * @returns Unique key string
   */
  private static createKey(config: SnapkitConfig): string {
    // Since SnapkitUrlBuilder only uses organizationName,
    // we only need organizationName in the cache key
    return config.organizationName;
  }

  /**
   * Get the number of cached instances (for debugging/monitoring)
   */
  static getCacheSize(): number {
    return this.instances.size;
  }
}
