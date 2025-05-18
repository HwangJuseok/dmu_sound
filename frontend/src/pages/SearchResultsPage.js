import { useLocation } from "react-router-dom";
import { dummyChart, dummyTracks } from "../utils/dummyData";

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q")?.toLowerCase() || "";

  const filteredResults = dummyChart.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery) ||
      track.artist.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">검색 결과: "{searchQuery}"</h2>
      {filteredResults.length > 0 ? (
        <ul>
          {filteredResults.map((track) => (
            <li key={track.id} className="mb-2 border-b pb-2">
              <strong>{track.title}</strong> - {track.artist}
            </li>
          ))}
        </ul>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;