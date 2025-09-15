import { describe, it, expect } from 'vitest';
import { mergeConfiguration, createBuildOptions } from '../configMerger';
import type { SnapkitConfig } from '@snapkit/core';

describe('configMerger', () => {
  describe('mergeConfiguration', () => {
    it('should merge component props with global config', () => {
      const options = {
        organizationName: 'test-org',
        baseUrl: 'https://test.com',
        quality: 90,
      };
      const config: SnapkitConfig = {
        organizationName: 'default-org',
        baseUrl: 'https://default.com',
        defaultQuality: 85,
      };

      const result = mergeConfiguration(options, config);

      expect(result).toEqual({
        finalOrganizationName: 'test-org',
        finalBaseUrl: 'https://test.com',
        finalQuality: 90,
      });
    });

    it('should use config defaults when props are not provided', () => {
      const options = {};
      const config: SnapkitConfig = {
        organizationName: 'default-org',
        baseUrl: 'https://default.com',
        defaultQuality: 85,
      };

      const result = mergeConfiguration(options, config);

      expect(result).toEqual({
        finalOrganizationName: 'default-org',
        finalBaseUrl: 'https://default.com',
        finalQuality: 85,
      });
    });

    it('should use fallback values when neither props nor config are provided', () => {
      const options = {};
      const config: SnapkitConfig = {};

      const result = mergeConfiguration(options, config);

      expect(result).toEqual({
        finalOrganizationName: '',
        finalBaseUrl: undefined,
        finalQuality: 85,
      });
    });

    it('should prioritize component props over config', () => {
      const options = {
        organizationName: 'component-org',
        quality: 95,
      };
      const config: SnapkitConfig = {
        organizationName: 'config-org',
        defaultQuality: 80,
      };

      const result = mergeConfiguration(options, config);

      expect(result).toEqual({
        finalOrganizationName: 'component-org',
        finalBaseUrl: undefined,
        finalQuality: 95,
      });
    });
  });

  describe('createBuildOptions', () => {
    it('should create build options with organization name and base URL', () => {
      const result = createBuildOptions('test-org', 'https://test.com');

      expect(result).toEqual({
        baseUrl: 'https://test.com',
        organizationName: 'test-org',
      });
    });

    it('should create build options without base URL', () => {
      const result = createBuildOptions('test-org');

      expect(result).toEqual({
        baseUrl: undefined,
        organizationName: 'test-org',
      });
    });

    it('should handle empty organization name', () => {
      const result = createBuildOptions('', 'https://test.com');

      expect(result).toEqual({
        baseUrl: 'https://test.com',
        organizationName: '',
      });
    });
  });
});
