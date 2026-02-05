import { useEffect } from 'react';
import { useMessage } from '../hooks/useMessage';
import constants from '../constants';

type Props = {
  value: string,
  placeholder: string,
  searchMessage?: string;
  onValueChange: (arg0: string) => void;
  onSearchClick: () => void;
  onSearchChange: () => void;
};

const SearchBar = ({
  value,
  placeholder,
  searchMessage,
  onValueChange,
  onSearchClick,
  onSearchChange
}: Props) => {
  const { getMessage } = useMessage();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchChange();
    }, constants.SEARCH.DEBOUNCE_TIME);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchMessage, onSearchClick]);

  return (
    <div className="search-container">
      <input type="text"
        placeholder={placeholder}
        value={value}
        onChange={e => onValueChange(e.target.value)}
        onKeyDown={e => e.key === "Enter" && onSearchClick()}
      />
      <button onClick={() => onSearchClick()}>
        {searchMessage ?? getMessage("main.search")}
      </button>
    </div>
  );
};

export default SearchBar;