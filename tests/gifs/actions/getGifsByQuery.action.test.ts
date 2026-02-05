import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGifsByQUery } from "@/gifs/actions/getGifsByQuery.action";

import { giphyApi } from "@/gifs/api/giphy.api";
import constants from "@/shared/constants";
import type { GiphyResponse } from "@/types/giphy.response";

// Mock the giphy API
vi.mock("@/gifs/api/giphy.api", () => ({
  giphyApi: {
    get: vi.fn(),
  },
}));

// Mock constants
vi.mock("@/shared/constants", () => ({
  default: {
    GENERAL: {
      DEFAULT_LANG: "en",
    },
    API: {
      DEFAULT_GIFS: 10,
    },
  },
}));

describe("getGifsByQUery", () => {
  const mockGiphyResponse: GiphyResponse = {
    data: [
      {
        id: "gif1",
        title: "Funny Cat",
        type: "gif",
        url: "",
        images: {
          original: {
            url: "https://example.com/cat.gif",
            width: "480",
            height: "270",
          },
        },
      },
      {
        id: "gif2",
        title: "Happy Dog",
        type: "gif",
        url: "",
        images: {
          original: {
            url: "https://example.com/dog.gif",
            width: "640",
            height: "360",
          },
        },
      },
    ],
    pagination: {
      total_count: 100,
      count: 2,
      offset: 0,
    },
    meta: {
      status: 200,
      msg: "OK",
      response_id: "abc123",
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Successful API calls", () => {
    it("should fetch gifs with default parameters", async () => {
      vi.mocked(giphyApi.get).mockResolvedValue({ data: mockGiphyResponse });

      const result = await getGifsByQUery({ q: "cats" });

      expect(giphyApi.get).toHaveBeenCalledWith(
        "https://api.giphy.com/v1/gifs/search",
        {
          params: {
            lang: constants.GENERAL.DEFAULT_LANG,
            limit: constants.API.DEFAULT_GIFS,
            q: "cats",
          },
        },
      );

      expect(result).toHaveLength(2);
    });

    it("should fetch gifs with custom limit", async () => {
      vi.mocked(giphyApi.get).mockResolvedValue({ data: mockGiphyResponse });

      await getGifsByQUery({ q: "dogs", limit: 25 });

      expect(giphyApi.get).toHaveBeenCalledWith(
        "https://api.giphy.com/v1/gifs/search",
        {
          params: {
            lang: constants.GENERAL.DEFAULT_LANG,
            limit: 25,
            q: "dogs",
          },
        },
      );
    });
  });

  describe("Data transformation", () => {
    it("should correctly transform API response to expected format", async () => {
      vi.mocked(giphyApi.get).mockResolvedValue({ data: mockGiphyResponse });

      const result = await getGifsByQUery({ q: "test" });

      expect(result).toEqual([
        {
          id: "gif1",
          title: "Funny Cat",
          url: "https://example.com/cat.gif",
          width: 480,
          height: 270,
        },
        {
          id: "gif2",
          title: "Happy Dog",
          url: "https://example.com/dog.gif",
          width: 640,
          height: 360,
        },
      ]);
    });

    it("should handle empty results", async () => {
      const emptyResponse: GiphyResponse = {
        data: [],
        pagination: {
          total_count: 0,
          count: 0,
          offset: 0,
        },
        meta: {
          status: 200,
          msg: "OK",
          response_id: "xyz789",
        },
      };

      vi.mocked(giphyApi.get).mockResolvedValue({ data: emptyResponse });

      const result = await getGifsByQUery({ q: "nonexistent" });

      expect(result).toEqual([]);
    });
  });

  describe("Error handling", () => {
    it("should throw error when API call fails", async () => {
      const apiError = new Error("Network error");
      vi.mocked(giphyApi.get).mockRejectedValue(apiError);

      await expect(getGifsByQUery({ q: "cats" })).rejects.toThrow(
        "Network error",
      );
    });

    it("should throw error when API returns error response", async () => {
      const apiError = {
        response: {
          status: 429,
          data: { message: "Rate limit exceeded" },
        },
      };
      vi.mocked(giphyApi.get).mockRejectedValue(apiError);

      await expect(getGifsByQUery({ q: "dogs" })).rejects.toEqual(apiError);
    });
  });

  describe("Edge cases", () => {
    it("should handle special characters in query", async () => {
      vi.mocked(giphyApi.get).mockResolvedValue({ data: mockGiphyResponse });

      await getGifsByQUery({ q: "cats & dogs!" });

      expect(giphyApi.get).toHaveBeenCalledWith(
        "https://api.giphy.com/v1/gifs/search",
        expect.objectContaining({
          params: expect.objectContaining({
            q: "cats & dogs!",
          }),
        }),
      );
    });

    it("should handle empty query string", async () => {
      vi.mocked(giphyApi.get).mockResolvedValue({ data: mockGiphyResponse });

      await getGifsByQUery({ q: "" });

      expect(giphyApi.get).toHaveBeenCalledWith(
        "https://api.giphy.com/v1/gifs/search",
        expect.objectContaining({
          params: expect.objectContaining({
            q: "",
          }),
        }),
      );
    });

    it("should handle limit of 0", async () => {
      vi.mocked(giphyApi.get).mockResolvedValue({ data: mockGiphyResponse });

      await getGifsByQUery({ q: "test", limit: 0 });

      expect(giphyApi.get).toHaveBeenCalledWith(
        "https://api.giphy.com/v1/gifs/search",
        expect.objectContaining({
          params: expect.objectContaining({
            limit: 0,
          }),
        }),
      );
    });
  });
});
