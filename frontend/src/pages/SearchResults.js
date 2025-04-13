import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/App.css";

const SearchResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");

    const [artistResults, setArtistResults] = useState([]);
    const [trackResults, setTrackResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            try {
                const response = await axios.get(`http://localhost:8080/spotify/search?query=${encodeURIComponent(query)}`);
                setArtistResults(response.data.artists || []);
                setTrackResults(response.data.tracks || []);
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

            <h2>🎵 제목 관련 결과</h2>
            <ul className="track-list">
                {trackResults.length === 0 ? (
                    <p>관련 제목 결과 없음</p>
                ) : (
                    trackResults.map((track) => (
                        <li key={track.id} className="track-item" onClick={() => navigate(`/track/${track.id}`)}>
                            <p><strong>{track.name}</strong> - {track.artist}</p>
                        </li>
                    ))
                )}
            </ul>

            <h2>👤 아티스트 관련 결과</h2>
            <ul className="track-list">
                {artistResults.length === 0 ? (
                    <p>관련 아티스트 결과 없음</p>
                ) : (
                    artistResults.map((artist) => (
                        <li key={artist.id} className="track-item" onClick={() => navigate(`/track/${artist.id}`)}>
                            <p><strong>{artist.name}</strong> - {artist.artist}</p>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default SearchResult;
