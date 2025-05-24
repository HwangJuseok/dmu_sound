import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/DetailPage.css"; // CSS 파일 추가 필요

function DetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [artistData, setArtistData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchArtistDetail(id);
        }
    }, [id]);

    const fetchArtistDetail = async (artistId) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/artist/${artistId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch artist details');
            }
            const data = await response.json();
            setArtistData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleTrackClick = (trackId) => {
        navigate(`/track/${trackId}`);
    };

    const handleBackClick = () => {
        navigate(-1); // 이전 페이지로 돌아가기
    };

    if (loading) {
        return (
            <div className="artist-detail-container">
                <div className="loading">
                    <h2>아티스트 정보를 불러오는 중...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="artist-detail-container">
                <div className="error">
                    <h2>오류가 발생했습니다</h2>
                    <p>{error}</p>
                    <button onClick={handleBackClick} className="back-button">
                        돌아가기
                    </button>
                </div>
            </div>
        );
    }

    if (!artistData) {
        return (
            <div className="artist-detail-container">
                <div className="not-found">
                    <h2>아티스트를 찾을 수 없습니다</h2>
                    <button onClick={handleBackClick} className="back-button">
                        돌아가기
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="artist-detail-container">
            <header className="artist-header">
                <button onClick={handleBackClick} className="back-button">
                    ← 돌아가기
                </button>
                <h1>DMU Sound - 아티스트 상세</h1>
            </header>

            <main className="artist-main">
                {/* 아티스트 기본 정보 섹션 */}
                <section className="artist-info">
                    <div className="artist-profile">
                        <h2 className="artist-name">{artistData.name}</h2>
                        <img
                            src={artistData.imageUrl}
                            alt={artistData.name}
                            className="artist-image"
                            width="300"
                            onError={(e) => {
                                e.target.src = '/default-artist-image.jpg'; // 기본 이미지 경로
                            }}
                        />
                        <div className="artist-stats">
                            <p>총 {artistData.getTopTrackCount || artistData.topTracks?.length || 0}개의 인기 트랙</p>
                        </div>
                    </div>
                </section>

                {/* 인기 트랙 섹션 */}
                <section className="top-tracks">
                    <h3>🎵 Top 10 Tracks</h3>
                    {artistData.topTracks && artistData.topTracks.length > 0 ? (
                        <ul className="top-track-list">
                            {artistData.topTracks.map((track, index) => (
                                <li key={track.id} className="top-track-item">
                                    <div className="track-rank">
                                        {index + 1}
                                    </div>
                                    <img
                                        src={track.imageUrl}
                                        alt={track.trackName}
                                        className="track-thumbnail"
                                        width="50"
                                        height="50"
                                        onError={(e) => {
                                            e.target.src = '/default-track-image.jpg'; // 기본 이미지 경로
                                        }}
                                    />
                                    <div className="track-info">
                                        <div
                                            className="track-title"
                                            onClick={() => handleTrackClick(track.id)}
                                        >
                                            {track.trackName}
                                        </div>
                                        <div className="track-album">
                                            {track.albumName}
                                        </div>
                                    </div>
                                    <div className="track-actions">
                                        <button
                                            className="play-button"
                                            onClick={() => handleTrackClick(track.id)}
                                        >
                                            ▶ 재생
                                        </button>
                                        {track.previewUrl && (
                                            <audio controls className="preview-audio">
                                                <source src={track.previewUrl} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="no-tracks">
                            <p>Top 트랙 정보를 불러올 수 없습니다.</p>
                        </div>
                    )}
                </section>

                {/* 추가 정보 섹션 */}
                <section className="additional-info">
                    <h3>📊 아티스트 정보</h3>
                    <div className="info-grid">
                        <div className="info-card">
                            <h4>인기도</h4>
                            <p>Spotify 기준 인기 트랙 {artistData.topTracks?.length || 0}곡</p>
                        </div>
                        <div className="info-card">
                            <h4>장르</h4>
                            <p>다양한 장르의 음악을 선보이는 아티스트</p>
                        </div>
                        <div className="info-card">
                            <h4>활동</h4>
                            <p>현재 활발히 활동 중인 아티스트</p>
                        </div>
                    </div>
                </section>

                {/* 관련 링크 섹션 */}
                <section className="related-links">
                    <h3>🔗 관련 링크</h3>
                    <div className="link-buttons">
                        <button
                            className="spotify-link"
                            onClick={() => window.open(`https://open.spotify.com/artist/${artistData.id}`, '_blank')}
                        >
                            Spotify에서 보기
                        </button>
                        <button
                            className="search-link"
                            onClick={() => {
                                // 현재 프로젝트의 라우팅 구조에 맞춰 수정
                                const searchQuery = encodeURIComponent(artistData.name);
                                // 옵션 1: 메인 페이지로 이동
                                // navigate('/');
                                // 옵션 2: 뒤로가기
                                // navigate(-1);
                                // 옵션 3: 검색 페이지가 있다면 해당 경로 사용
                                 navigate(`/search?q=${searchQuery}`);
                            }}
                        >
                            가수이름으로 재검색
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default DetailPage;