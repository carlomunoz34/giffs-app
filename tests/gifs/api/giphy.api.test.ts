import { giphyApi } from "@/gifs/api/giphy.api";
import { describe, expect, test } from "vitest";

describe('giphy.api.test', () => {
  test('should configured properly', () => {
    expect(giphyApi.defaults.baseURL).toBe("https://api.giphy.com/v1/gifs");
    expect(giphyApi.defaults.params).toStrictEqual({
      rating: "r",
      api_key: import.meta.env.VITE_API_KEY,
    });
  });
});