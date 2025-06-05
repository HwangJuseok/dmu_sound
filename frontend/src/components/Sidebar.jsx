// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/Sidebar.css";

function Sidebar({ onToggle, user, logout, loading }) {
    const [playlists, setPlaylists] = useState([]);
    const [playlistLoading, setPlaylistLoading] = useState(false);
    const [error, setError] = useState(null);

    // API 기본 URL 설정
    const API_BASE_URL = 'http://localhost:8080';

    // 플레이리스트 가져오기 함수
    const fetchPlaylists = async (userCode) => {
        try {
            setPlaylistLoading(true);
            setError(null);

            console.log('📡 Sidebar - Fetching playlists for userCode:', userCode);

            const response = await fetch(`${API_BASE_URL}/api/playlists/user/${userCode}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 404) {
                    // 플레이리스트가 없는 경우
                    console.log('📝 Sidebar - No playlists found for user');
                    setPlaylists([]);
                    return;
                }
                throw new Error(`플레이리스트 조회 실패: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Sidebar - Playlists fetched:', data);
            setPlaylists(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('❌ Sidebar - 플레이리스트 조회 오류:', err);
            setError(err.message);
            setPlaylists([]);
        } finally {
            setPlaylistLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.usercode) {
            // 사용자가 로그인했을 때 API에서 플레이리스트 불러오기
            fetchPlaylists(user.usercode);
        } else {
            // 사용자가 로그아웃했을 때 플레이리스트 초기화
            setPlaylists([]);
            setError(null);
        }
    }, [user]);

    return (
        <aside className="sidebar">
            <button className="close-button" onClick={onToggle}>☰</button>
            <h2>dmu_sound</h2>

            <nav>
                <p><Link to="/">🏠 홈</Link></p>
                <p><Link to="/chart">📊 차트</Link></p>
                {user && <p><Link to="/playlist">🎵 플레이리스트</Link></p>}
                {user && <p><Link to="/MyPageRecommendations">⭐ 앱 연동</Link></p>}
            </nav>

            <hr />

            {loading ? (
                <div className="loading-section">
                    <p>로딩 중...</p>
                </div>
            ) : user ? (
                <div className="user-playlists">
                    <h4>내 플레이리스트</h4>
                    {playlistLoading ? (
                        <p>플레이리스트 로딩 중...</p>
                    ) : error ? (
                        <div className="error-section">
                            <p>오류: {error}</p>
                            <button 
                                onClick={() => fetchPlaylists(user.usercode)}
                                className="retry-btn"
                            >
                                재시도
                            </button>
                        </div>
                    ) : playlists.length > 0 ? (
                        <div className="playlist-list">
                            {playlists.map((playlist) => (
                                <p key={playlist.playlist_id}>
                                    <Link to={`/playlist/${playlist.playlist_id}`}>
                                        {playlist.playlist_name}
                                    </Link>
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p>저장된 플레이리스트 없음</p>
                    )}
                </div>
            ) : (
                <div className="login-required">
                    <p>로그인 시 플레이리스트가 표시됩니다.</p>
                    <div className="sidebar-auth-buttons">
                        <Link to="/auth/login" className="sidebar-login-btn">로그인</Link> | 
                        <Link to="/auth/register" className="sidebar-register-btn"> 회원가입</Link>
                    </div>
                </div>
            )}
        </aside>
    );
}

export default Sidebar;