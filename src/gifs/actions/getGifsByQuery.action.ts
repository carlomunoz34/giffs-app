import constants from "../../shared/constants";
import type { GiphyResponse } from "../../types/giphy.response";
import type { Languages } from "../../types/messages.types";
import { giphyApi } from "../api/giphy.api";

type Params = {
  q: string,
  limit?: number;
  lang?: Languages;
};

export const getGifsByQUery = async (params: Params) => {
  const response = await giphyApi.get<GiphyResponse>("https://api.giphy.com/v1/gifs/search", {
    params: {
      lang: constants.GENERAL.DEFAULT_LANG,
      limit: constants.API.DEFAULT_GIFS,
      ...params
    }
  });

  return response.data.data.map((rawGif) => ({
    id: rawGif.id,
    title: rawGif.title,
    url: rawGif.images.original.url,
    width: Number(rawGif.images.original.height),
    height: Number(rawGif.images.original.width)
  }));
};