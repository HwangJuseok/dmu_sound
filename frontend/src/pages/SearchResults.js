import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/App.css"; // 스타일 파일 적용

const SearchResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            try {
                const response = await axios.get(`http://localhost:8080/spotify/search?query=${encodeURIComponent(query)}`);
                setSearchResults(response.data || []);
            } catch (error) {
                setError("검색 중 오류가 발생했습니다.");
                console.error("Spotify 검색 오류:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSearchResults();
    }, [query]);

    return (
        <div className="container">
            <h1>🔍 검색 결과: {query}</h1>
            {loading && <p>검색 중...</p>}
            {error && <p className="error">{error}</p>}
            {!loading && !error && searchResults.length === 0 && <p>검색 결과가 없습니다.</p>}
            <ul className="track-list">
                {searchResults.map((track) => (
                    <li 
                        key={track.id} 
                        className="track-item"
                        onClick={() => navigate(`/track/${track.id}`)} // 클릭 시 TrackDetail로 이동
                        style={{ cursor: "pointer" }} // 마우스 오버 시 클릭 가능한 것처럼 변경
                    >
                        <p><strong>{track.name}</strong> - {track.artist}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResult;
