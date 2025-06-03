// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/Sidebar.css";

function Sidebar({ onToggle, user, logout, loading }) {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (user) {
            // 사용자가 로그인했을 때 플레이리스트 불러오기
            const stored = localStorage.getItem("myPlaylists");
            if (stored) {
                try {
                    setPlaylists(JSON.parse(stored));
                } catch (error) {
                    console.error("플레이리스트 로드 오류:", error);
                    setPlaylists([]);
                }
            }
        } else {
            // 사용자가 로그아웃했을 때 플레이리스트 초기화
            setPlaylists([]);
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
                    {playlists.length > 0 ? (
                        playlists.map((playlist) => (
                            <p key={playlist.id}>
                                <Link to={`/playlist/${playlist.id}`}>{playlist.name}</Link>
                            </p>
                        ))
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