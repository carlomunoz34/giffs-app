import { useMessage } from "./shared/hooks/useMessage";

import GifContainer from "./gifs/components/GifContainer";
import History from "./gifs/components/History";
import AppHeader from "./shared/components/AppHeader";
import SearchBar from "./shared/components/SearchBar";

import { useGif } from "./gifs/hooks/useGif";
import { useState } from "react";

const GifsApp = () => {
  const { getMessage } = useMessage();
  const [searchValue, setSearchValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  const {
    gifsData,
    fetchGifs
  } = useGif();

  const handleSearchClick = () => {
    if (searchValue === "") {
      return;
    }

    fetchGifs(searchValue);
    setHistory([searchValue, ...history].splice(0, 7));
    setSearchValue("");
  };

  const handleSearchChange = () => {
    fetchGifs(searchValue);
  };

  const handleHistoryClick = (search: string) => {
    setSearchValue(search);
    fetchGifs(search);
  };

  return (
    <>
      <AppHeader title={getMessage("main.title")}
        subtitle={getMessage("main.subtitle")}
      />
      <SearchBar value={searchValue}
        placeholder={getMessage("search.placeholder")}
        onValueChange={newValue => setSearchValue(newValue)}
        onSearchClick={handleSearchClick}
        onSearchChange={handleSearchChange}
      />
      <History data={history}
        onSearchClick={handleHistoryClick}
      />
      <GifContainer data={gifsData} />
    </>
  );
};

export default GifsApp;