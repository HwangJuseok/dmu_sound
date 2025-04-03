import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/App.css"; // 스타일 파일 적용

const Home = () => {
    const [trendingVideos, setTrendingVideos] = useState([]);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTrendingVideos = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/youtube/trending");
                setTrendingVideos(response.data.items || []);
            } catch (error) {
                console.error("유튜브 API 오류:", error);
            }
        };
        fetchTrendingVideos();
    }, []);

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?query=${query}`);
        }
    };

    return (
        <div className="container">
            <h1>🎵 음악 정보 제공 페이지</h1>

            {/* 검색창 */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="곡 검색..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button onClick={handleSearch}>검색</button>
            </div>

            {/* 유튜브 인기 차트 */}
            <h2>🎶 유튜브 인기 차트</h2>
            <ul className="video-list">
                {trendingVideos.map((video, index) => (
                    <li key={index} className="video-item">
                        <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                            {video.snippet.title} - {video.snippet.channelTitle}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
