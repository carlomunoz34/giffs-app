import { toggleFeatureFlag } from '@/redux/featureFlagsSlice';
import { useFeatureFlag } from '@/shared/hooks/useFeatureFlag';
import type { FeatureFlagName } from '@/types/featureFlags.types';
import { renderHook } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';

import { beforeEach, describe, expect, test, vi, type MockedFunction } from 'vitest';

// Mock Redux hooks
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

// Mock the redux slice
vi.mock('../../redux/featureFlagsSlice', () => ({
  getFeatureFlags: vi.fn(),
  toggleFeatureFlag: vi.fn(),
}));

describe('useFeatureFlag', () => {
  const mockDispatch = vi.fn();
  const mockUseDispatch = useDispatch as MockedFunction<typeof useDispatch>;
  const mockUseSelector = useSelector as MockedFunction<typeof useSelector>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  describe('isFeatureFlagEnabled', () => {
    test('should return true when feature flag is in the list', () => {
      const mockFlags: FeatureFlagName[] = ["staticData"];
      mockUseSelector.mockReturnValue(mockFlags);

      const { result } = renderHook(() => useFeatureFlag());

      expect(result.current.isFeatureFlagEnabled("staticData")).toBe(true);
    });

    test('should return false when feature flag is not in the list', () => {
      const mockFlags: FeatureFlagName[] = [];
      mockUseSelector.mockReturnValue(mockFlags);

      const { result } = renderHook(() => useFeatureFlag());

      expect(result.current.isFeatureFlagEnabled("staticData")).toBe(false);
    });
  });

  describe('enableFeatureFlag', () => {
    test('should dispatch toggleFeatureFlag when flag is currently disabled', () => {
      const mockFlags: FeatureFlagName[] = [];
      mockUseSelector.mockReturnValue(mockFlags);

      const { result } = renderHook(() => useFeatureFlag());
      result.current.enableFeatureFlag("staticData" as FeatureFlagName);

      expect(mockDispatch).toHaveBeenCalledWith(toggleFeatureFlag("staticData"));
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    test('should NOT dispatch when flag is already enabled', () => {
      const mockFlags: FeatureFlagName[] = ["staticData"];
      mockUseSelector.mockReturnValue(mockFlags);

      const { result } = renderHook(() => useFeatureFlag());
      result.current.enableFeatureFlag("staticData");

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('disableFeatureFlag', () => {
    test('should dispatch toggleFeatureFlag when flag is currently enabled', () => {
      const mockFlags: FeatureFlagName[] = ["staticData"];
      mockUseSelector.mockReturnValue(mockFlags);

      const { result } = renderHook(() => useFeatureFlag());
      result.current.disableFeatureFlag("staticData");

      expect(mockDispatch).toHaveBeenCalledWith(toggleFeatureFlag("staticData"));
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    test('should NOT dispatch when flag is already disabled', () => {
      const mockFlags: FeatureFlagName[] = [];
      mockUseSelector.mockReturnValue(mockFlags);

      const { result } = renderHook(() => useFeatureFlag());
      result.current.disableFeatureFlag("staticData" as FeatureFlagName);

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    test('should update behavior when Redux state changes', () => {
      const mockFlags1: FeatureFlagName[] = [];
      mockUseSelector.mockReturnValue(mockFlags1);

      const { result, rerender } = renderHook(() => useFeatureFlag());

      expect(result.current.isFeatureFlagEnabled("staticData" as FeatureFlagName)).toBe(false);

      // Simulate Redux state change
      const mockFlags2: FeatureFlagName[] = ["staticData"];
      mockUseSelector.mockReturnValue(mockFlags2);
      rerender();

      expect(result.current.isFeatureFlagEnabled("staticData")).toBe(true);
    });
  });
});
