import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar"; 
import "../styles/Chart.css";

function Chart() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/youtube/trending`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error("Error fetching trending videos:", err);
        setError("인기 차트를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, []);

  if (loading) {
    return (
      <div className="chart-page">
        <p>📡 차트를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-page">
        <p className="error-message">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="chart-page">
      <header className="chart-header">
        <h1>📊 실시간 차트</h1>
        <div className="chart-search-wrapper">
          <SearchBar
            placeholder="아티스트, 곡명, 앨범을 검색하세요..."
            onSearch={(query) => {
              window.location.href = `/search?query=${encodeURIComponent(query)}`;
            }}
          />
        </div>
      </header>

      <ul className="chart-list">
        {videos.map((video, index) => (
          <li key={index} className="chart-item">
            <span className="rank">{index + 1}</span>
            <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
              <img src={video.thumbnailUrl} alt={video.title} />
            </a>
            <div className="info">
              <span className="title">{video.title}</span>
              <span className="artist">{video.channel}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chart;
