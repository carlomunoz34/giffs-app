import constants from "../../shared/constants";
import type { Gif } from "../../types/gifs.types";

export const useGifsCache = () => {
  type StoredGif = Record<string, Gif[]>;
  const id = constants.LOCAL_STORAGE.GIFS_CACHE;

  let storedRawObject = localStorage.getItem(id);
  let storedObject: StoredGif;
  if (!storedRawObject) {
    storedObject = {};
  } else {
    storedObject = JSON.parse(storedRawObject);
  }

  const getCachedGifs = (key: string) => storedObject[key];
  const setCachedGifs = (key: string, value: Gif[]) => {
    storedObject[key] = value;
    localStorage.setItem(id, JSON.stringify(storedObject));
  };
  const deleteCachedGifs = () => {
    storedObject = {};
    localStorage.removeItem(id);
  };

  return {
    getCachedGifs,
    setCachedGifs,
    deleteCachedGifs
  };
};