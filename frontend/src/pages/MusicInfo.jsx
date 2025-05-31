import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "../styles/MusicInfo.css";

function MusicInfo() {
    const { id } = useParams();
    const location = useLocation();
    const [trackData, setTrackData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL 파라미터에서 전달받은 데이터
    const { title, artist, album, cover } = location.state || {};

    useEffect(() => {
        if (id) {
            fetchTrackDetail(id);
        }
    }, [id]);

    const fetchTrackDetail = async (trackId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/track/${trackId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch track details');
            }
            const data = await response.json();
            setTrackData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="music-container">
                <div className="loading">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="music-container">
                <div className="error">오류가 발생했습니다: {error}</div>
            </div>
        );
    }

    // 백엔드에서 받은 데이터 또는 기본값 사용
    const track = trackData?.track;
    const musicVideo = trackData?.musicVideo;
    const coverVideos = trackData?.coverVideos || [];
    const handleAddToPlaylist = async () => {
    try {                             
        const response = await fetch("/api/playlist/add", { // 이 부분은 백엔드 라우터
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            trackId: track?.trackId,
            trackName: track?.trackName,
            artistName: track?.artistName,
            albumName: track?.albumName,
            imageUrl: track?.imageUrl,
            previewUrl: track?.previewUrl,
        }),
        });

        if (!response.ok) throw new Error("플레이리스트 추가 실패");

        alert("✅ 플레이리스트에 추가되었습니다!");
    } catch (err) {
        alert("❌ 추가 중 오류 발생: " + err.message);
    }
    };

    return (
        <div className="music-container">
            <div className="main-content">
                {/* 앨범 커버 + 정보 */}
                <div className="album-section">
                    <section className="track-info">
                        <button className="add-to-playlist-button" onClick={handleAddToPlaylist}>
                        ➕ 플레이리스트에 추가
                        </button>


                        
                        <h2>
                            {track?.trackName || title || "노래제목"} - {track?.artistName || artist || "가수"}
                        </h2>
                        <img
                            src={track?.imageUrl || cover}
                            alt={track?.trackName || title || "노래제목"}
                            className="track-image"
                            width="300"
                        />
                        <p>Album: {track?.albumName || album || "앨범명"}</p>
                        <p>
                            Artist:{" "}
                            <a href={`/detail/${track?.artistId}`} className="artist-link">
                                {track?.artistName || artist || "가수"}
                            </a>
                        </p>
                        {track?.previewUrl && (
                            <div className="preview-section">
                                <h4>미리듣기</h4>
                                <audio controls>
                                    <source src={track.previewUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </section>
                </div>

                {/* Video Section */}
                <div className="video-section">
                    <h3>🎬 뮤직비디오</h3>
                    {musicVideo ? (
                        <div className="video-container">
                            <iframe
                                width="560"
                                height="315"
                                src={musicVideo}
                                title="Music Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <div className="video-grid">
                            {["뮤비 1", "뮤비 2"].map((text, i) => (
                                <div key={i} className="video-thumbnail">
                                    {text}
                                    <button className="play-button">▶</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <h3>🎥 커버 영상</h3>
                    {coverVideos.length > 0 ? (
                        <div className="video-grid">
                            {coverVideos.map((video, index) => (
                                <div key={index} className="video-item">
                                    <iframe
                                        width="280"
                                        height="157"
                                        src={`https://www.youtube.com/embed/${video.videoId}`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                    <p className="video-title">{video.title}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="video-grid">
                            {["커버 1", "커버 2"].map((text, i) => (
                                <div key={i} className="video-thumbnail">
                                    {text}
                                    <button className="play-button">▶</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Related Videos */}
                <div className="related-section">
                    <h3>📺 관련 영상</h3>
                    <ul>
                        <li>인터뷰: {track?.artistName || artist || "가수"}의 비하인드 스토리</li>
                        <li>{track?.trackName || title || "노래"}의 라이브 무대 영상</li>
                        <li>{track?.artistName || artist || "가수"} - 다른 히트곡 모음</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default MusicInfo;