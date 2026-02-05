import axios from "axios";

export const giphyApi = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs",
  params: {
    rating: "r",
    api_key: import.meta.env.VITE_API_KEY
  }
});