// Sidebar.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/components/Sidebar.css";

function Sidebar({ onToggle, user }) {
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem("myPlaylists");
            if (stored) {
                setPlaylists(JSON.parse(stored));
            }
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
            </nav>

            <hr />

            {user ? (
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
                <p className="login-required">로그인 시 플레이리스트가 표시됩니다.</p>
            )}
        </aside>
    );
}

export default Sidebar;
