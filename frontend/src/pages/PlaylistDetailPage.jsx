import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/PlaylistDetailPage.css";
import { useAuth } from "../contexts/AuthContext";

function PlaylistDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const userCode = user?.usercode;
    const [playlist, setPlaylist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API 기본 URL 설정
    const API_BASE_URL = 'http://localhost:8080';

    // 총 재생시간 계산 함수
    const getTotalDuration = () => {
        if (!tracks || tracks.length === 0) return "0분";

        const totalMs = tracks.reduce((total, track) => {
            return total + (track.duration_ms || 0);
        }, 0);

        const minutes = Math.floor(totalMs / 60000);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `약 ${hours}시간 ${minutes % 60}분`;
        }
        return `약 ${minutes}분`;
    };

    // 개별 트랙 재생시간 포맷팅 함수
    const formatDuration = (durationMs) => {
        if (!durationMs) return "0:00";

        const totalSeconds = Math.floor(durationMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (id && user && userCode) {
            fetchPlaylistData();
        } else if (!user) {
            setError('로그인이 필요합니다.');
            setLoading(false);
        }
    }, [id, user, userCode]);

    const fetchPlaylistData = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('Fetching playlist data for:', { id, userCode });

            // 플레이리스트 기본 정보 조회 (유저의 플레이리스트 목록에서 찾기)
            const playlistResponse = await fetch(`${API_BASE_URL}/api/playlists/user/${userCode}`, {
                credentials: 'include'
            });

            if (!playlistResponse.ok) {
                throw new Error('플레이리스트 조회 실패');
            }

            const playlists = await playlistResponse.json();
            console.log('User playlists:', playlists);

            // 🔧 수정: String 타입으로 비교 (타입 변환 추가)
            const currentPlaylist = playlists.find(p => String(p.playlist_id) === String(id));

            if (!currentPlaylist) {
                console.log('Available playlist IDs:', playlists.map(p => p.playlist_id));
                console.log('Looking for ID:', id);
                throw new Error('존재하지 않는 플레이리스트이거나 접근 권한이 없습니다.');
            }

            setPlaylist(currentPlaylist);

            // 플레이리스트 트랙 목록 조회
            const tracksResponse = await fetch(`${API_BASE_URL}/api/playlists/${id}/tracks`, {
                credentials: 'include'
            });

            if (!tracksResponse.ok) {
                if (tracksResponse.status === 404) {
                    // 트랙이 없는 경우
                    setTracks([]);
                    return;
                }
                throw new Error('트랙 목록 조회 실패');
            }

            const tracksData = await tracksResponse.json();
            console.log('Playlist tracks:', tracksData);
            setTracks(Array.isArray(tracksData) ? tracksData : []);

        } catch (err) {
            console.error('플레이리스트 데이터 조회 오류:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔧 수정: 실제 API를 호출하도록 변경
    const handleRemoveTrack = async (spotifyId) => {
        if (!window.confirm("이 곡을 플레이리스트에서 제거하시겠습니까?")) {
            return;
        }

        try {
            // ✅ 올바른 API 경로로 수정
            const response = await fetch(
                `${API_BASE_URL}/api/playlists/${id}/tracks?trackId=${spotifyId}&userCode=${userCode}`,
                {
                    method: 'DELETE',
                    credentials: 'include'
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            // 성공시 UI에서 제거
            setTracks(tracks.filter(track => track.spotify_id !== spotifyId && track.track_id !== spotifyId));
            alert("✅ 곡이 제거되었습니다.");
        } catch (err) {
            console.error('Track removal error:', err);
            alert("❌ 제거 실패: " + err.message);
        }
    };

    if (!user) {
        return (
            <div className="playlist-detail-page">
                <div className="auth-required">
                    <h2>로그인 필요</h2>
                    <p>플레이리스트를 보려면 로그인이 필요합니다.</p>
                    <div className="auth-buttons">
                        <Link to="/auth/login" className="login-btn">로그인</Link>
                        <Link to="/playlist" className="back-link">← 플레이리스트 목록</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="playlist-detail-page">
                <div className="loading">로딩 중...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="playlist-detail-page">
                <div className="error">
                    <h2>오류가 발생했습니다</h2>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button onClick={fetchPlaylistData} className="retry-btn">다시 시도</button>
                        <Link to="/playlist" className="back-link">← 플레이리스트 목록</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="playlist-detail-page">
                <div className="not-found">
                    <h2>플레이리스트를 찾을 수 없습니다</h2>
                    <Link to="/playlist" className="back-link">← 플레이리스트 목록</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="playlist-detail-page">
            {/* 헤더 섹션 */}
            <div className="playlist-header">
                <div className="navigation">
                    <Link to="/playlist" className="back-link">
                        ← 플레이리스트 목록
                    </Link>
                </div>

                <div className="playlist-info">
                    <div className="playlist-cover">
                        <div className="cover-placeholder">
                            🎵
                        </div>
                    </div>

                    <div className="playlist-meta">
                        <span className="playlist-type">플레이리스트</span>
                        <h1 className="playlist-title">{playlist.playlist_name}</h1>

                        <div className="playlist-stats">
                            <span className="owner">🎧 {user.userId}</span>
                            <span className="separator">•</span>
                            <span className="track-count">{tracks.length}곡</span>
                            {tracks.length > 0 && (
                                <>
                                    <span className="separator">•</span>
                                    <span className="duration">{getTotalDuration()}</span>
                                </>
                            )}
                        </div>

                        <p className="created-date">
                            📅 생성일: {new Date(playlist.added_at).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                        </p>
                    </div>
                </div>
            </div>

            {/* 트랙 목록 섹션 */}
            <div className="tracks-section">
                {tracks.length > 0 ? (
                    <>
                        <div className="tracks-header">
                            <div className="track-list-title">
                                <h2>트랙 목록</h2>
                            </div>
                        </div>

                        <div className="tracks-table">
                            <div className="table-header">
                                <div className="col-number">#</div>
                                <div className="col-title">제목</div>
                                <div className="col-artist">아티스트</div>
                                <div className="col-added">추가일</div>
                                <div className="col-duration">재생시간</div>
                                <div className="col-actions">작업</div>
                            </div>

                            <div className="tracks-list">
                                {tracks.map((track, index) => (
                                    <div key={`${track.track_id}-${index}`} className="track-row">
                                        <div className="col-number">
                                            <span className="track-number">{index + 1}</span>
                                        </div>

                                        <div className="col-title">
                                            <div className="track-info">
                                                <img
                                                    src={track.image_url || '/default-album-cover.png'}
                                                    alt={track.track_name}
                                                    className="track-image"
                                                    onError={(e) => {
                                                        e.target.src = '/default-album-cover.png';
                                                    }}
                                                />
                                                <div className="track-details">
                                                    <h3 className="track-name">{track.track_name}</h3>
                                                    <p className="album-name">{track.album_name || '알 수 없음'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-artist">
                                            <span className="artist-name">{track.artist_name}</span>
                                        </div>

                                        <div className="col-added">
                                            <span className="added-date">
                                                {new Date(track.added_at).toLocaleDateString('ko-KR')}
                                            </span>
                                        </div>

                                        <div className="col-duration">
                                            <span className="duration">
                                                {formatDuration(track.duration_ms)}
                                            </span>
                                        </div>

                                        <div className="col-actions">
                                            <div className="track-actions">
                                                <Link
                                                    to={`/music/${track.spotify_id || track.track_id}`}
                                                    state={{
                                                        title: track.track_name,
                                                        artist: track.artist_name,
                                                        cover: track.image_url
                                                    }}
                                                    className="action-btn view-btn"
                                                    title="상세보기"
                                                >
                                                    👁️
                                                </Link>
                                                <button
                                                    onClick={() => handleRemoveTrack(track.spotify_id || track.track_id)}
                                                    className="action-btn remove-btn"
                                                    title="제거"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="empty-playlist">
                        <div className="empty-icon">🎵</div>
                        <h3>플레이리스트가 비어있습니다</h3>
                        <p>음악을 검색해서 이 플레이리스트에 곡을 추가해보세요!</p>
                        <Link to="/search" className="search-link">
                            🔍 음악 검색하러 가기
                        </Link>
                    </div>
                )}
            </div>

            {/* 푸터 */}
            <div className="playlist-footer">
                <Link to="/playlist" className="footer-link">
                    ← 내 플레이리스트로 돌아가기
                </Link>
            </div>
        </div>
    );
}

export default PlaylistDetailPage;