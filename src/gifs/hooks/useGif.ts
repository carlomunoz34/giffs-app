import { useState, useEffect } from "react";
import { useFeatureFlag } from "../../shared/hooks/useFeatureFlag";
import { useMessage } from "../../shared/hooks/useMessage";
import { mockGifs } from "../../static/gifs.mock";
import type { Gif } from "../../types/gifs.types";
import { getGifsByQUery } from "../actions/getGifsByQuery.action";
import { useGifsCache } from "./useGifsCache";

export const useGif = () => {
  const { isFeatureFlagEnabled } = useFeatureFlag();
  const staticData = isFeatureFlagEnabled("staticData");

  const { locale } = useMessage();
  const [gifsData, setGifsData] = useState<Gif[]>(staticData ? mockGifs : []);
  const { getCachedGifs, setCachedGifs, deleteCachedGifs } = useGifsCache();

  useEffect(() => () => deleteCachedGifs(), []);

  const fetchGifs = async (query: string) => {
    query = query.trim().toLowerCase();
    if (query === "" || staticData) {
      return;
    }
    const cachedGifs = getCachedGifs(query);
    if (cachedGifs) {
      setGifsData(cachedGifs);
      return;
    }
    const gifs = await getGifsByQUery({ q: query, lang: locale });
    setCachedGifs(query, gifs);
    setGifsData(gifs);
  };

  return {
    gifsData,
    fetchGifs
  };
};
