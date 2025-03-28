import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/App.css"; // 스타일을 분리하여 가져오기

const App = () => {
    const [trendingVideos, setTrendingVideos] = useState([]);
    const [spotifyTrack, setSpotifyTrack] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    // 유튜브 인기 차트 가져오기
    useEffect(() => {
        const fetchTrendingVideos = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/youtube/trending");
                setTrendingVideos(response.data.items || []);
            } catch (error) {
                setErrorMessage("유튜브 API 연동 실패: " + error.message);
            }
        };
        fetchTrendingVideos();
    }, []);

    // Spotify 곡 정보 가져오기
    useEffect(() => {
        const fetchSpotifyTrack = async () => {
            try {
                const response = await axios.get("http://localhost:8080/spotify/search?query=");
                const track = response.data.tracks?.items?.[0]; // 서버에서 받은 첫 번째 곡 사용
                
                if (track) {
                    setSpotifyTrack({
                        name: track.name,
                        artist: track.artists.map(artist => artist.name).join(", "),
                        album: track.album.name,
                        releaseDate: track.album.release_date,
                        imageUrl: track.album.images[0]?.url,
                        previewUrl: track.preview_url
                    });
                } else {
                    setErrorMessage("Spotify에서 곡을 찾을 수 없습니다.");
                }
            } catch (error) {
                setErrorMessage("Spotify API 연동 실패: " + error.message);
            }
        };
        fetchSpotifyTrack();
    }, []);

    return (
        <div className="container">
            <h1>🎵 음악 정보 제공 페이지</h1>

            {/* 유튜브 인기 차트 */}
            <h2>🎶 유튜브 인기 차트</h2>
            {trendingVideos.length > 0 ? (
                <ul className="video-list">
                    {trendingVideos.map((video, index) => (
                        <li key={index}>
                            <a
                                href={`https://www.youtube.com/watch?v=${video.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {video.snippet.title} - {video.snippet.channelTitle}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>유튜브 인기 차트를 불러오는 중...</p>
            )}

            {/* Spotify 곡 정보 */}
            <h2>🎧 Spotify 곡 정보</h2>
            {spotifyTrack ? (
                <div className="spotify-track">
                    {spotifyTrack.imageUrl && <img src={spotifyTrack.imageUrl} alt="앨범 커버" className="album-cover" />}
                    <p><strong>곡명:</strong> {spotifyTrack.name}</p>
                    <p><strong>아티스트:</strong> {spotifyTrack.artist}</p>
                    <p><strong>앨범:</strong> {spotifyTrack.album}</p>
                    <p><strong>발매일:</strong> {spotifyTrack.releaseDate}</p>
                    {spotifyTrack.previewUrl && (
                        <audio controls>
                            <source src={spotifyTrack.previewUrl} type="audio/mpeg" />
                            브라우저가 오디오 태그를 지원하지 않습니다.
                        </audio>
                    )}
                </div>
            ) : (
                <p>Spotify 곡 정보를 불러오는 중...</p>
            )}

            {/* 오류 메시지 표시 */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default App;
