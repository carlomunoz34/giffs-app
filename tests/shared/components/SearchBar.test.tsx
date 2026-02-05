import { screen, fireEvent } from '@testing-library/react';
import { describe, expect, vi, beforeEach, afterEach, test } from 'vitest';
import { useMessage } from '@/shared/hooks/useMessage';
import SearchBar from '@/shared/components/SearchBar';
import constants from '@/shared/constants';
import { renderWithProviders } from '../../test-utils';

// Mock the useMessage hook
vi.mock('@/shared/hooks/useMessage', () => ({
  useMessage: vi.fn(),
}));

// Mock constants
vi.mock('@/shared/constants', () => ({
  default: {
    SEARCH: {
      DEBOUNCE_TIME: 500,
    },
  },
}));

describe('SearchBar', () => {
  const mockGetMessage = vi.fn();
  const mockOnValueChange = vi.fn();
  const mockOnSearchClick = vi.fn();
  const mockOnSearchChange = vi.fn();

  const defaultProps = {
    value: '',
    placeholder: 'Search...',
    onValueChange: mockOnValueChange,
    onSearchClick: mockOnSearchClick,
    onSearchChange: mockOnSearchChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    (useMessage as any).mockReturnValue({
      getMessage: mockGetMessage,
    });
    mockGetMessage.mockReturnValue('Search');
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    test('should renderWithProviders input with correct placeholder and value', () => {
      const testValue = "test query";
      const testPlaceholder = "Type here...";
      renderWithProviders(<SearchBar {...defaultProps} value={testValue} placeholder={testPlaceholder} />);

      const input = screen.getByPlaceholderText(testPlaceholder);
      expect(input).toBeDefined();
      expect(input.getAttribute("value")).toBe(testValue);
      expect(input.getAttribute("placeholder")).toBe(testPlaceholder);
    });

    test('should renderWithProviders button with default search message', () => {
      renderWithProviders(<SearchBar {...defaultProps} />);

      expect(mockGetMessage).toHaveBeenCalledWith('main.search');
      expect(screen.getByRole('button', { name: 'Search' })).toBeDefined();
    });

    test('should renderWithProviders button with custom search message when provided', () => {
      renderWithProviders(<SearchBar {...defaultProps} searchMessage="Find Now" />);

      expect(mockGetMessage).not.toHaveBeenCalled();
      expect(screen.getByRole('button', { name: 'Find Now' })).toBeDefined();
    });
  });

  describe('User Interactions', () => {
    test('should call onValueChange when user types in input', async () => {
      renderWithProviders(<SearchBar {...defaultProps} />);

      const inputTest = "test";
      const input = screen.getByPlaceholderText('Search...');

      fireEvent.change(input, { target: { value: inputTest } });

      expect(mockOnValueChange).toHaveBeenCalledTimes(1);
      expect(mockOnValueChange).toHaveBeenCalledWith(inputTest);
    });

    test('should call onSearchClick when button is clicked', () => {
      renderWithProviders(<SearchBar {...defaultProps} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(mockOnSearchClick).toHaveBeenCalledTimes(1);
    });

    test('should call onSearchClick when Enter key is pressed', () => {
      renderWithProviders(<SearchBar {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

      expect(mockOnSearchClick).toHaveBeenCalledTimes(1);
    });

    test('should NOT call onSearchClick when other keys are pressed', () => {
      renderWithProviders(<SearchBar {...defaultProps} />);

      const input = screen.getByPlaceholderText('Search...');
      fireEvent.keyDown(input, { key: 'a', code: 'KeyA' });
      fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

      expect(mockOnSearchClick).not.toHaveBeenCalled();
    });
  });

  describe('Debounce Functionality', () => {
    test('should call onSearchChange after debounce time', () => {
      renderWithProviders(<SearchBar {...defaultProps} searchMessage="query1" />);

      expect(mockOnSearchChange).not.toHaveBeenCalled();

      vi.advanceTimersByTime(constants.SEARCH.DEBOUNCE_TIME);

      expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
    });

    test('should NOT call onSearchChange before debounce time elapses', () => {
      renderWithProviders(<SearchBar {...defaultProps} searchMessage="query1" />);

      vi.advanceTimersByTime(constants.SEARCH.DEBOUNCE_TIME - 100);

      expect(mockOnSearchChange).not.toHaveBeenCalled();
    });

    test('should reset debounce timer when searchMessage changes', () => {
      const { rerender } = renderWithProviders(<SearchBar {...defaultProps} searchMessage="query1" />);

      vi.advanceTimersByTime(300);

      // Change searchMessage - should reset timer
      rerender(<SearchBar {...defaultProps} searchMessage="query2" />);

      vi.advanceTimersByTime(300);
      expect(mockOnSearchChange).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
    });

    test('should reset debounce timer when onSearchChange changes', () => {
      const newOnSearchChange = vi.fn();
      const { rerender } = renderWithProviders(<SearchBar {...defaultProps} />);

      vi.advanceTimersByTime(300);

      // Change onSearchChange - should reset timer
      rerender(<SearchBar {...defaultProps} onSearchChange={newOnSearchChange} />);

      vi.advanceTimersByTime(300);
      expect(mockOnSearchChange).not.toHaveBeenCalled();
      expect(newOnSearchChange).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(mockOnSearchChange).not.toHaveBeenCalled();
      expect(newOnSearchChange).toHaveBeenCalledTimes(1);
    });

    test('should cleanup timeout on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');
      const { unmount } = renderWithProviders(<SearchBar {...defaultProps} searchMessage="query1" />);

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    test('should handle rapid changes by debouncing correctly', () => {
      const { rerender } = renderWithProviders(<SearchBar {...defaultProps} searchMessage="a" />);

      vi.advanceTimersByTime(100);
      rerender(<SearchBar {...defaultProps} searchMessage="ab" />);

      vi.advanceTimersByTime(100);
      rerender(<SearchBar {...defaultProps} searchMessage="abc" />);

      vi.advanceTimersByTime(100);
      rerender(<SearchBar {...defaultProps} searchMessage="abcd" />);

      // Still shouldn't have called yet
      expect(mockOnSearchChange).not.toHaveBeenCalled();

      // Now wait full debounce time from last change
      vi.advanceTimersByTime(constants.SEARCH.DEBOUNCE_TIME);

      // Should only be called once after all changes
      expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty value', () => {
      renderWithProviders(<SearchBar {...defaultProps} value="" />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input.getAttribute("value")).toBe('');
    });

    test('should handle special characters in value', () => {
      renderWithProviders(<SearchBar {...defaultProps} value="test@#$%^&*()" />);

      const input = screen.getByPlaceholderText('Search...');
      expect(input.getAttribute("value")).toBe('test@#$%^&*()');
    });

    test('should not debounce on initial mount if searchMessage is undefined', () => {
      renderWithProviders(<SearchBar {...defaultProps} />);

      vi.advanceTimersByTime(constants.SEARCH.DEBOUNCE_TIME);

      expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
    });
  });
});
