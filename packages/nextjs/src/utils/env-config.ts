import {
  getEnvConfig as coreGetEnvConfig,
  mergeConfigWithEnv as coreMergeConfigWithEnv,
  validateEnvConfig as coreValidateEnvConfig,
  EnvironmentStrategy,
  SnapkitConfig,
} from '@snapkit-studio/core';

/**
 * Next.js-specific strategy that ONLY uses NEXT_PUBLIC_ variables
 * This strategy always takes precedence in Next.js environment
 */
const nextjsStrategy: EnvironmentStrategy = {
  name: 'nextjs',
  getEnvVar: (name: string) => {
    // Next.js requires explicit environment variable references for build-time replacement
    switch (name) {
      case 'SNAPKIT_ORGANIZATION_NAME':
        return process.env.NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME;
      case 'SNAPKIT_DEFAULT_QUALITY':
        return process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_QUALITY;
      case 'SNAPKIT_DEFAULT_OPTIMIZE_FORMAT':
        return process.env.NEXT_PUBLIC_SNAPKIT_DEFAULT_OPTIMIZE_FORMAT;
      default:
        return undefined;
    }
  },
  detect: () => true, // Always use this strategy in Next.js package
};

/**
 * Parse environment config with Next.js specific validation
 * Only reads NEXT_PUBLIC_ prefixed environment variables
 */
export function parseEnvConfig(): SnapkitConfig {
  const envConfig = coreGetEnvConfig(nextjsStrategy);

  // Validate with strict mode for Next.js
  const { isValid, errors, warnings } = validateEnvConfig();

  if (warnings.length > 0) {
    console.warn(`Next.js environment warnings: ${warnings.join(', ')}`);
  }

  if (!isValid) {
    throw new Error(
      `Invalid Next.js environment variables: ${errors.join(', ')}`,
    );
  }

  // Unnecessary check, but just for type safety
  if (!envConfig.SNAPKIT_ORGANIZATION_NAME) {
    throw new Error('NEXT_PUBLIC_SNAPKIT_ORGANIZATION_NAME is not set');
  }

  return {
    organizationName: envConfig.SNAPKIT_ORGANIZATION_NAME,
    defaultQuality: envConfig.SNAPKIT_DEFAULT_QUALITY || 85,
    defaultFormat: envConfig.SNAPKIT_DEFAULT_OPTIMIZE_FORMAT || 'auto',
  };
}

/**
 * Merge environment variables and props to return final configuration
 * Uses strict validation for Next.js environment with NEXT_PUBLIC_ variables only
 */
export function mergeConfigWithEnv(
  propsConfig: Partial<SnapkitConfig>,
): SnapkitConfig {
  return coreMergeConfigWithEnv(propsConfig, nextjsStrategy, true);
}

/**
 * Validate environment configuration with Next.js strict mode
 * Only validates NEXT_PUBLIC_ prefixed environment variables
 */
export function validateEnvConfig() {
  const envConfig = coreGetEnvConfig(nextjsStrategy);
  return coreValidateEnvConfig(envConfig, true);
}
