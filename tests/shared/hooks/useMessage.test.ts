import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDispatch, useSelector } from "react-redux";

import { setLocale } from "@/redux/messagesSlice";
import type { Languages } from "@/types/messages.types";
import { useMessage } from "@/shared/hooks/useMessage";

// Mock Redux hooks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

// Mock the redux slice
vi.mock("@/redux/messagesSlice", () => ({
  selectLocale: vi.fn(),
  selectCurrentMessages: vi.fn(),
  setLocale: vi.fn(),
}));

describe("useMessage", () => {
  const mockDispatch = vi.fn();
  const mockUseDispatch = useDispatch as unknown as ReturnType<typeof vi.fn>;
  const mockUseSelector = useSelector as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  describe("getMessage", () => {
    it("should return message from currentMessages when key exists", () => {
      const mockMessages = {
        "greeting.hello": "Hello",
        "greeting.goodbye": "Goodbye",
      };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      expect(result.current.getMessage("greeting.hello")).toBe("Hello");
      expect(result.current.getMessage("greeting.goodbye")).toBe("Goodbye");
    });

    it("should return the key itself when message is not found", () => {
      const mockMessages = {
        "greeting.hello": "Hello",
      };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      expect(result.current.getMessage("nonexistent.key")).toBe(
        "nonexistent.key",
      );
    });

    it("should replace multiple parameters in message", () => {
      const mockMessages = {
        "user.info": "Hello {name}, you have {count} messages",
      };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      expect(
        result.current.getMessage("user.info", {
          "{name}": "Alice",
          "{count}": "5",
        }),
      ).toBe("Hello Alice, you have 5 messages");
    });

    it("should handle empty params object", () => {
      const mockMessages = {
        "simple.message": "This is a simple message",
      };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      expect(result.current.getMessage("simple.message", {})).toBe(
        "This is a simple message",
      );
    });

    it("should handle no params argument (default empty object)", () => {
      const mockMessages = {
        "simple.message": "This is a simple message",
      };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      expect(result.current.getMessage("simple.message")).toBe(
        "This is a simple message",
      );
    });

    it("should replace all occurrences of a parameter", () => {
      const mockMessages = {
        "repeat.message": "{value} and {value} make two {value}s",
      };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      expect(
        result.current.getMessage("repeat.message", { "{value}": "apple" }),
      ).toBe("apple and apple make two apples");
    });

    it("should handle params that do not exist in message", () => {
      const mockMessages = {
        "simple.message": "Hello World",
      };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      expect(
        result.current.getMessage("simple.message", { "{name}": "John" }),
      ).toBe("Hello World");
    });

    it("should handle empty message value", () => {
      const mockMessages = {
        "empty.message": "",
      };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      expect(result.current.getMessage("empty.message")).toBe("");
    });
  });

  describe("locale", () => {
    it("should return current locale from Redux state", () => {
      const mockMessages = { test: "Test" };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      expect(result.current.locale).toBe("en");
    });

    it("should return updated locale when state changes", () => {
      const mockMessages = { test: "Test" };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result, rerender } = renderHook(() => useMessage());

      expect(result.current.locale).toBe("en");

      // Simulate locale change in Redux
      mockUseSelector
        .mockReturnValueOnce("es")
        .mockReturnValueOnce(mockMessages);

      rerender();

      expect(result.current.locale).toBe("es");
    });
  });

  describe("changeLocale", () => {
    it("should dispatch setLocale action with new locale", () => {
      const mockMessages = { test: "Test" };

      mockUseSelector
        .mockReturnValueOnce("en")
        .mockReturnValueOnce(mockMessages);

      const { result } = renderHook(() => useMessage());

      result.current.changeLocale("es" as Languages);

      expect(mockDispatch).toHaveBeenCalledWith(setLocale("es"));
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });
});
