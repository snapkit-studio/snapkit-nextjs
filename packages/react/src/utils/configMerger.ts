import type { SnapkitConfig } from '@snapkit-studio/core';

/**
 * Configuration merging utilities for Snapkit components
 */

export interface ConfigMergeOptions {
  organizationName?: string;
  baseUrl?: string;
  quality?: number;
}

export interface MergedConfig {
  finalOrganizationName: string;
  finalBaseUrl?: string;
  finalQuality: number;
}

/**
 * Merges component props with global configuration
 * @param options - Component configuration options
 * @param config - Global Snapkit configuration
 * @returns Merged configuration
 */
export function mergeConfiguration(
  options: ConfigMergeOptions,
  config: SnapkitConfig,
): MergedConfig {
  return {
    finalOrganizationName: options.organizationName || config.organizationName || '',
    finalBaseUrl: options.baseUrl || config.baseUrl,
    finalQuality: options.quality || config.defaultQuality || 85,
  };
}

/**
 * Creates build options for image URL generation
 * @param finalOrganizationName - Organization name
 * @param finalBaseUrl - Base URL
 * @returns Build options object
 */
export function createBuildOptions(
  finalOrganizationName: string,
  finalBaseUrl?: string,
) {
  return {
    baseUrl: finalBaseUrl,
    organizationName: finalOrganizationName,
  };
}
