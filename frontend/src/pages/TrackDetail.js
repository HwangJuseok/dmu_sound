import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/App.css";

const TrackDetail = () => {
    const { id } = useParams();
    const [track, setTrack] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [youtubeVideoId, setYoutubeVideoId] = useState(null);
    const [coverVideos, setCoverVideos] = useState([]);
    const [youtubeError, setYoutubeError] = useState(null);
    const [coverError, setCoverError] = useState(null);
    const [youtubeLoading, setYoutubeLoading] = useState(false);
    const [coverLoading, setCoverLoading] = useState(false);

    // 🚀 트랙 정보 가져오기 (Spotify API)
    useEffect(() => {
        const fetchTrackDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/spotify/track/${id}`);
                setTrack(response.data);
            } catch (error) {
                setError("트랙 정보를 불러오는 중 오류가 발생했습니다.");
                console.error("Spotify 트랙 정보 오류:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrackDetails();
    }, [id]);

    // 🚀 YouTube API 요청을 일정 시간 후에 실행 (디바운싱)
    useEffect(() => {
        if (!track) return;

        let debounceTimer = setTimeout(() => {
            fetchYoutubeVideos();
            fetchCoverVideos();
        }, 1000); // 1초 대기 후 실행

        return () => clearTimeout(debounceTimer); // 이전 요청 취소
    }, [track]);

    // 🔥 유튜브 공식 뮤직비디오 검색 (캐싱 적용)
    const fetchYoutubeVideos = async () => {
        try {
            setYoutubeLoading(true);
            setYoutubeError(null);

            // 📌 캐싱 확인 (로컬 스토리지 활용)
            const cacheKey = `youtube_${track.name}_${track.artists[0].name}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                setYoutubeVideoId(JSON.parse(cachedData));
                setYoutubeLoading(false);
                return;
            }

            const query = `${track.name} ${track.artists[0].name} Music Video`;
            const response = await axios.get(`http://localhost:8080/api/youtube/search?keyword=${encodeURIComponent(query)}`);
            const data = response.data;

            if (data.items?.length > 0) {
                const videoId = data.items[0].id.videoId;
                setYoutubeVideoId(videoId);

                // 캐싱 저장
                localStorage.setItem(cacheKey, JSON.stringify(videoId));
            }
        } catch (error) {
            console.error("유튜브 검색 오류:", error);
            setYoutubeError("유튜브 영상을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setYoutubeLoading(false);
        }
    };

    // 🔥 유튜브 커버곡 검색 (최대 3개만 가져오기)
    const fetchCoverVideos = async () => {
        try {
            setCoverLoading(true);
            setCoverError(null);

            const query = `${track.name} cover`;
            const response = await axios.get(`http://localhost:8080/api/youtube/search?keyword=${encodeURIComponent(query)}&maxResults=3`);
            const data = response.data;

            if (data.items?.length > 0) {
                setCoverVideos(data.items.slice(0, 3));
            }
        } catch (error) {
            console.error("유튜브 커버곡 검색 오류:", error);
            setCoverError("커버곡 영상을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setCoverLoading(false);
        }
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!track) return <p>트랙 정보를 찾을 수 없습니다.</p>;

    return (
        <div className="container">
            <h1>{track.name}</h1>
            {track.album?.images?.length > 0 && (
                <img src={track.album.images[0].url} alt={track.album.name} className="album-cover" />
            )}
            <p><strong>아티스트:</strong> {track.artists.map(artist => artist.name).join(", ")}</p>
            <p><strong>앨범:</strong> {track.album.name}</p>
            <p><strong>발매일:</strong> {track.album.release_date}</p>

            {/* 🎧 Spotify 플레이어 섹션 */}
            <div className="spotify-section">
                <h2>🎧 Spotify로 듣기</h2>
                <iframe
                    src={`https://open.spotify.com/embed/track/${track.id}`}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify Player"
                ></iframe>
            </div>
            
            {/* 유튜브 공식 뮤직비디오 */}
            <div className="youtube-section">
                <h2>🎬 공식 뮤직비디오</h2>
                {youtubeLoading ? (
                    <p>로딩 중...</p>
                ) : youtubeError ? (
                    <p className="error">{youtubeError}</p>
                ) : youtubeVideoId ? (
                    <iframe
                        width="60%"
                        height="315"
                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                        title="YouTube Video Player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : (
                    <p>뮤직비디오를 찾을 수 없습니다.</p>
                )}
            </div>

            {/* 🎤 커버곡 섹션 */}
            <div className="cover-section">
                <h2>🎤 커버곡 추천</h2>
                {coverLoading ? (
                    <p>로딩 중...</p>
                ) : coverError ? (
                    <p className="error">{coverError}</p>
                ) : coverVideos.length > 0 ? (
                    <div className="cover-videos">
                        {coverVideos.map((video, index) => (
                            <iframe
                                key={index}
                                width="30%"
                                height="200"
                                src={`https://www.youtube.com/embed/${video.id.videoId}`}
                                title={`Cover Video ${index + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ))}
                    </div>
                ) : (
                    <p>커버곡을 찾을 수 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default TrackDetail;
