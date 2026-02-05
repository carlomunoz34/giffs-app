import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGif } from "@/gifs/hooks/useGif";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";
import { useMessage } from "@/shared/hooks/useMessage";
import { useGifsCache } from "@/gifs/hooks/useGifsCache";
import { getGifsByQUery } from "@/gifs/actions/getGifsByQuery.action";
import { mockGifs } from "@/static/gifs.mock";

// Mock all dependencies
vi.mock("@/shared/hooks/useFeatureFlag");
vi.mock("@/shared/hooks/useMessage");
vi.mock("@/gifs/actions/getGifsByQuery.action");
vi.mock("@/gifs/hooks/useGifsCache");
vi.mock(".@/static/gifs.mock", () => ({
  mockGifs: [
    { id: "1", title: "Mock Gif 1", url: "url1", width: 100, height: 100 },
    { id: "2", title: "Mock Gif 2", url: "url2", width: 200, height: 200 },
  ],
}));

describe("useGif", () => {
  const mockIsFeatureFlagEnabled = vi.fn();
  const mockGetCachedGifs = vi.fn();
  const mockSetCachedGifs = vi.fn();
  const mockDeleteCachedGifs = vi.fn();

  const mockFetchedGifs = [
    { id: "3", title: "Fetched Gif", url: "url3", width: 300, height: 300 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useFeatureFlag as any).mockReturnValue({
      isFeatureFlagEnabled: mockIsFeatureFlagEnabled,
    });

    (useMessage as any).mockReturnValue({
      locale: "en",
    });

    (useGifsCache as any).mockReturnValue({
      getCachedGifs: mockGetCachedGifs,
      setCachedGifs: mockSetCachedGifs,
      deleteCachedGifs: mockDeleteCachedGifs,
    });

    mockIsFeatureFlagEnabled.mockReturnValue(false);
    mockGetCachedGifs.mockReturnValue(null);
    (getGifsByQUery as any).mockResolvedValue(mockFetchedGifs);
  });

  describe("Initialization", () => {
    it("should initialize with empty array when staticData is disabled", () => {
      const { result } = renderHook(() => useGif());

      expect(result.current.gifsData).toEqual([]);
    });

    it("should initialize with mockGifs when staticData is enabled", () => {
      mockIsFeatureFlagEnabled.mockReturnValue(true);

      const { result } = renderHook(() => useGif());

      expect(result.current.gifsData).toEqual(mockGifs);
    });

    it("should call deleteCachedGifs on unmount", () => {
      const { unmount } = renderHook(() => useGif());

      unmount();

      expect(mockDeleteCachedGifs).toHaveBeenCalledTimes(1);
    });
  });

  describe("fetchGifs", () => {
    it("should not fetch when query is empty string", async () => {
      const { result } = renderHook(() => useGif());

      await result.current.fetchGifs("");

      expect(getGifsByQUery).not.toHaveBeenCalled();
      expect(result.current.gifsData).toEqual([]);
    });

    it("should not fetch when query is only whitespace", async () => {
      const { result } = renderHook(() => useGif());

      await result.current.fetchGifs("   ");

      expect(getGifsByQUery).not.toHaveBeenCalled();
    });

    it("should not fetch when staticData is enabled", async () => {
      mockIsFeatureFlagEnabled.mockReturnValue(true);
      const { result } = renderHook(() => useGif());

      await result.current.fetchGifs("cats");

      expect(getGifsByQUery).not.toHaveBeenCalled();
      expect(result.current.gifsData).toEqual(mockGifs);
    });

    it("should return cached gifs if available", async () => {
      const cachedGifs = [
        { id: "cached", title: "Cached", url: "cached", width: 50, height: 50 },
      ];
      mockGetCachedGifs.mockReturnValue(cachedGifs);

      const { result } = renderHook(() => useGif());

      await waitFor(async () => {
        await result.current.fetchGifs("cats");
      });

      await waitFor(() => {
        expect(result.current.gifsData).toEqual(cachedGifs);
      });

      expect(getGifsByQUery).not.toHaveBeenCalled();
      expect(mockSetCachedGifs).not.toHaveBeenCalled();
    });

    it("should fetch and cache gifs when not in cache", async () => {
      const { result } = renderHook(() => useGif());

      await waitFor(async () => {
        await result.current.fetchGifs("dogs");
      });

      await waitFor(() => {
        expect(result.current.gifsData).toEqual(mockFetchedGifs);
      });

      expect(getGifsByQUery).toHaveBeenCalledWith({ q: "dogs", lang: "en" });
      expect(mockSetCachedGifs).toHaveBeenCalledWith("dogs", mockFetchedGifs);
    });

    it("should use current locale when fetching", async () => {
      (useMessage as any).mockReturnValue({ locale: "es" });

      const { result } = renderHook(() => useGif());

      await waitFor(async () => {
        await result.current.fetchGifs("gatos");
      });

      await waitFor(() => {
        expect(getGifsByQUery).toHaveBeenCalledWith({ q: "gatos", lang: "es" });
      });
    });
  });

  describe("Multiple fetches", () => {
    it("should handle multiple different queries", async () => {
      const { result } = renderHook(() => useGif());

      await waitFor(async () => {
        await result.current.fetchGifs("cats");
      });
      await waitFor(() => {
        expect(result.current.gifsData).toEqual(mockFetchedGifs);
      });

      await waitFor(async () => {
        await result.current.fetchGifs("dogs");
      });
      await waitFor(() => {
        expect(mockGetCachedGifs).toHaveBeenCalledWith("dogs");
      });

      expect(getGifsByQUery).toHaveBeenCalledTimes(2);
    });

    it("should use cache on second fetch of same query", async () => {
      const { result } = renderHook(() => useGif());

      await waitFor(async () => {
        await result.current.fetchGifs("cats");
      });

      await waitFor(() => {
        expect(mockSetCachedGifs).toHaveBeenCalledWith("cats", mockFetchedGifs);
      });

      // Second fetch - should use cache
      mockGetCachedGifs.mockReturnValue(mockFetchedGifs);
      await waitFor(async () => {
        await result.current.fetchGifs("cats");
      });

      expect(getGifsByQUery).toHaveBeenCalledTimes(1);
    });
  });
});
