import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import "../styles/SearchResultsPage.css";

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
              "Content-Type": "application/json",
              Accept: "application/json",
            },
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
      <header className="search-header">
        <h2 className="search-title">검색 결과: "{searchQuery}"</h2>
        <div className="chart-search-wrapper">
          <SearchBar
            placeholder="아티스트, 곡명, 앨범을 검색하세요..."
            onSearch={(query) => {
              window.location.href = `/search?q=${encodeURIComponent(query)}`;
            }}
          />
        </div>
      </header>

      

      {loading && <p className="loading-text">로딩 중...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && results.length === 0 && (
        <p className="no-results-text">검색 결과가 없습니다.</p>
      )}

      <ul className="result-list">
  {results.map((item) => (
    <li key={item.id} className="result-item">
      <img
        src={item.imageUrl}
        alt={item.name}
        className="result-image"
      />
      <div className="result-details">
        {/* 공통 이름 링크 처리 */}
        {item.subInfo === 'Artist' ? (
          <Link to={`/detail/${item.id}`} className="result-name-link">
            <strong className="result-name">{item.name}</strong>
          </Link>
        ) : (
          <Link to={`/music/${item.id}`} className="result-name-link">
            <strong className="result-name">{item.name}</strong>
          </Link>
        )}
        <br />
        {item.subInfo && (
          <span className="result-subinfo">{item.subInfo}</span>
        )}
        <br />
        {/* 트랙일 경우에만 상세보기 링크 표시 */}
        {item.isTrack && (
          <Link to={`/detail/${item.id}`} className="detail-link">
            트랙 상세보기
          </Link>
        )}
      </div>
    </li>
  ))}
</ul>
    </div>
  );
};

export default SearchResultsPage;
