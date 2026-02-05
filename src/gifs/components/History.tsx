import { useMessage } from "../../shared/hooks/useMessage";

type Props = {
  data: string[];
  onSearchClick: (arg0: string) => void;
};

const History = ({ data, onSearchClick }: Props) => {
  const { getMessage } = useMessage();

  return (
    <div className="previous-searches">
      <h2>{getMessage("main.previousSearches")}</h2>
      <ul className="previous-searches-list">
        {data.map(name =>
          <li key={name} onClick={() => onSearchClick(name)}>
            {name}
          </li>
        )}
      </ul>
    </div>
  );
};

export default History;