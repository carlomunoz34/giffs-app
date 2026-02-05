import { useGifsCache } from "@/gifs/hooks/useGifsCache";
import constants from "@/shared/constants";
import type { Gif } from "@/types/gifs.types";
import { renderHook } from "@testing-library/react";
import { afterAll, describe, expect, test, vi } from "vitest";

describe('useGifsCache', () => {
  const id = constants.LOCAL_STORAGE.GIFS_CACHE;
  const key = "test";
  const value: Gif[] = [];

  afterAll(() => {
    vi.restoreAllMocks();
  });

  test('should add elements', () => {
    const { result } = renderHook(() => useGifsCache());
    result.current.setCachedGifs(key, value);

    expect(localStorage.setItem).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith(id, JSON.stringify({ [key]: value }));
  });

  test('should get elements if they exists', () => {
    const cache = { [key]: value };
    (localStorage.getItem as any).mockReturnValue(JSON.stringify(cache));
    const { result } = renderHook(() => useGifsCache());
    const gifs = result.current.getCachedGifs(key);

    expect(localStorage.getItem).toHaveBeenCalled();
    expect(localStorage.getItem).toHaveBeenCalledWith(id);
    expect(gifs).toStrictEqual(cache[key]);
  });

  test('should delete cache', () => {
    const { result } = renderHook(() => useGifsCache());
    result.current.deleteCachedGifs();

    expect(localStorage.removeItem).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith(id);
  });
});
