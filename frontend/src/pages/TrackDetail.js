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

    useEffect(() => {
        if (track) {
            const fetchYoutubeVideos = async () => {
                try {
                    const query = `${track.name} ${track.artists[0].name} Official Music Video`;
                    const response = await axios.get(`http://localhost:8080/api/youtube/search?keyword=${encodeURIComponent(query)}`);
                    const data = response.data;

                    if (data.items?.length > 0) {
                        // "official" 또는 "뮤직비디오" 포함된 영상 찾기
                        const officialVideo = data.items.find(video =>
                            video.snippet.title.toLowerCase().includes("official") ||
                            video.snippet.title.toLowerCase().includes("뮤직비디오") ||
                            video.snippet.title.toLowerCase().includes("mv")
                        );

                        setYoutubeVideoId(officialVideo ? officialVideo.id.videoId : data.items[0].id.videoId);
                    }
                } catch (error) {
                    console.error("유튜브 검색 오류:", error);
                }
            };

            const fetchCoverVideos = async () => {
                try {
                    const query = `${track.name} cover`;
                    const response = await axios.get(`http://localhost:8080/api/youtube/search?keyword=${encodeURIComponent(query)}`);
                    const data = response.data;

                    if (data.items?.length > 0) {
                        setCoverVideos(data.items.slice(0, 3)); // 상위 3개 커버 영상만 저장
                    }
                } catch (error) {
                    console.error("유튜브 커버곡 검색 오류:", error);
                }
            };

            fetchYoutubeVideos();
            fetchCoverVideos();
        }
    }, [track]);

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

            {/* Spotify 임베드 플레이어 */}
            <iframe
                src={`https://open.spotify.com/embed/track/${id}`}
                width="60%"
                height="300"
                frameBorder="0"
                allow="encrypted-media"
                title="Spotify Player"
            ></iframe>

            {/* 유튜브 공식 뮤직비디오 */}
            {youtubeVideoId && (
                <div className="youtube-video">
                    <h2>🎬 공식 뮤직비디오</h2>
                    <iframe
                        width="60%"
                        height="315"
                        src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                        title="YouTube Video Player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            {/* 🎤 커버곡 섹션 */}
            {coverVideos.length > 0 && (
                <div className="cover-section">
                    <h2>🎤 커버곡 추천</h2>
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
                </div>
            )}
        </div>
    );
};

export default TrackDetail;
