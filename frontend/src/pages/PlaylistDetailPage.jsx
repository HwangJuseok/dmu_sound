import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "../styles/PlaylistDetailPage.css";

function PlaylistDetailPage() {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 임시 userCode - 실제로는 로그인 시스템에서 가져와야 함
    const userCode = "user123";

    useEffect(() => {
        if (id) {
            fetchPlaylistData();
        }
    }, [id]);

    const fetchPlaylistData = async () => {
        try {
            setLoading(true);

            // 플레이리스트 기본 정보 조회 (유저의 플레이리스트 목록에서 찾기)
            const playlistResponse = await fetch(`/api/playlists/user/${userCode}`);
            if (!playlistResponse.ok) {
                throw new Error('플레이리스트 조회 실패');
            }
            const playlists = await playlistResponse.json();
            const currentPlaylist = playlists.find(p => p.playlist_id === id);

            if (!currentPlaylist) {
                throw new Error('존재하지 않는 플레이리스트입니다.');
            }

            setPlaylist(currentPlaylist);

            // 플레이리스트 트랙 목록 조회
            const tracksResponse = await fetch(`/api/playlists/${id}/tracks`);
            if (!tracksResponse.ok) {
                throw new Error('트랙 목록 조회 실패');
            }
            const tracksData = await tracksResponse.json();
            setTracks(tracksData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveTrack = async (spotifyId) => {
        if (!window.confirm("이 곡을 플레이리스트에서 제거하시겠습니까?")) {
            return;
        }

        try {
            // 백엔드에 트랙 삭제 API가 없어서 임시로 프론트엔드에서만 제거
            // 실제로는 DELETE /api/playlists/{playlistId}/tracks/{spotifyId} API가 필요함
            setTracks(tracks.filter(track => track.spotify_id !== spotifyId));
            alert("곡이 제거되었습니다.");
        } catch (err) {
            alert("❌ 제거 실패: " + err.message);
        }
    };

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
                <div className="error">오류가 발생했습니다: {error}</div>
                <Link to="/playlist">플레이리스트 목록으로 돌아가기</Link>
            </div>
        );
    }

    if (!playlist) {
        return (
            <div className="playlist-detail-page">
                <div>존재하지 않는 플레이리스트입니다.</div>
                <Link to="/playlist">플레이리스트 목록으로 돌아가기</Link>
            </div>
        );
    }

    return (
        <div className="playlist-detail-page">
            <div className="playlist-header">
                <Link to="/playlist" className="back-link">← 플레이리스트 목록</Link>
                <h1>{playlist.playlist_name}</h1>
                <p>생성일: {new Date(playlist.added_at).toLocaleDateString()}</p>
                <p>총 {tracks.length}곡</p>
            </div>

            <div className="tracks-section">
                {tracks.length > 0 ? (
                    <div className="tracks-list">
                        {tracks.map((track, index) => (
                            <div key={`${track.spotify_id}-${index}`} className="track-card">
                                <div className="track-number">{index + 1}</div>
                                <img
                                    src={track.image_url || '/default-album-cover.png'}
                                    alt={track.track_name}
                                    className="track-image"
                                    width={60}
                                    height={60}
                                />
                                <div className="track-info">
                                    <h3>{track.track_name}</h3>
                                    <p>{track.artist_name}</p>
                                    <p className="added-date">
                                        추가일: {new Date(track.added_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="track-actions">
                                    <Link
                                        to={`/music/${track.spotify_id}`}
                                        state={{
                                            title: track.track_name,
                                            artist: track.artist_name,
                                            cover: track.image_url
                                        }}
                                        className="view-detail-btn"
                                    >
                                        상세보기
                                    </Link>
                                    <button
                                        onClick={() => handleRemoveTrack(track.spotify_id)}
                                        className="remove-btn"
                                    >
                                        제거
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-playlist">
                        <p>플레이리스트에 곡이 없습니다.</p>
                        <p>음악 검색에서 곡을 추가해보세요!</p>
                        <Link to="/search" className="search-link">음악 검색하러 가기</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PlaylistDetailPage;