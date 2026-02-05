import type { Gif } from '../../types/gifs.types';

type Props = {
  data: Gif[];
};

const GifContainer = ({ data }: Props) => {
  return (
    <div className="gifs-container">
      {data.map((gif) => (
        <div
          key={gif.id}
          className="gif-card"
        >
          <img
            src={gif.url}
            alt={gif.title}
          />
          <h3>{gif.title}</h3>
          <p>
            {gif.width}x{gif.height}
          </p>
        </div>
      ))}
    </div>
  );
};

export default GifContainer;