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
                // 🔥 캐싱된 데이터 확인
                const cachedData = localStorage.getItem("youtube_trending");
                const cachedTime = localStorage.getItem("youtube_trending_time");
                
                // 📌 1시간(3600초) 내에 요청된 데이터가 있으면 API 요청 안 함
                if (cachedData && cachedTime && (Date.now() - cachedTime < 3600000)) {
                    setTrendingVideos(JSON.parse(cachedData));
                    return;
                }

                // ✅ API 요청 (캐싱 적용)
                const response = await axios.get("http://localhost:8080/api/youtube/trending");
                const videos = response.data.items || [];
                
                setTrendingVideos(videos);

                // ✅ 로컬 스토리지에 데이터 & 저장 시간 기록
                localStorage.setItem("youtube_trending", JSON.stringify(videos));
                localStorage.setItem("youtube_trending_time", Date.now());
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
                {trendingVideos.length > 0 ? (
                    trendingVideos.map((video, index) => (
                        <li key={index} className="video-item">
                            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                                {video.snippet.title} - {video.snippet.channelTitle}
                            </a>
                        </li>
                    ))
                ) : (
                    <p>인기 차트를 불러올 수 없습니다.</p>
                )}
            </ul>
        </div>
    );
};

export default Home;
