import {Link, useLocation} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/SearchResultsPage.css";  // CSS 분리해서 import

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery) return;

      try {
        setLoading(true);

        const response = await axios.get(
            `http://localhost:8080/api/search?query=${encodeURIComponent(searchQuery)}`,
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
        );

        if (Array.isArray(response.data)) {
          setResults(response.data);
        } else if (Array.isArray(response.data.results)) {
          setResults(response.data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError("검색 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  return (
    <div className="search-results-container">
      <h2 className="search-title">검색 결과: "{searchQuery}"</h2>

      {loading && <p className="loading-text">로딩 중...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && results.length === 0 && <p className="no-results-text">검색 결과가 없습니다.</p>}

     <ul className="result-list">
        {results.length > 0 ? (
          results.map((item) => (
            <li key={item.id} className="result-item">
              <img src={item.imageUrl} alt={item.name} className="result-image" />
              <div className="result-details">
                {/* 제목에 링크 걸기 */}
                <Link to={`/music/${item.id}`} className="result-name-link">
                  <strong className="result-name">{item.name}</strong>
                </Link>
                <br />
                {item.subInfo && <span className="result-subinfo">{item.subInfo}</span>}
                <br />
                {item.isTrack && (
                    <Link to={`/detail/${item.id}`} className="detail-link">
                      트랙 상세보기
                    </Link>
                )}
              </div>
            </li>
          ))
        ) : null}
      </ul>
    </div>
  );
};

export default SearchResultsPage;
