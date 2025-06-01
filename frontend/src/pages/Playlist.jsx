import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Playlist.css";
import { useAuth } from "../contexts/AuthContext";

function Playlist() {
  const { user } = useAuth();
  const userCode = user?.usercode || "guest";
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 임시 userCode - 실제로는 로그인 시스템에서 가져와야 함
  // const userCode = "user123"; // 또는 localStorage, context 등에서 가져오기

  // 컴포넌트 마운트 시 플레이리스트 목록 로드
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/playlists/user/${userCode}`);
      if (!response.ok) {
        throw new Error('플레이리스트 조회 실패');
      }
      const data = await response.json();
      setPlaylists(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) {
      alert("플레이리스트 이름을 입력해주세요.");
      return;
    }

    try {
      const playlistData = {
        playlist_name: newName,
        user_code: userCode
      };

      const response = await fetch('/api/playlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playlistData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("✅ 플레이리스트가 생성되었습니다!");
      setNewName("");
      // 플레이리스트 목록 새로고침
      fetchPlaylists();
    } catch (err) {
      alert("❌ 플레이리스트 생성 실패: " + err.message);
    }
  };

  const handleDelete = async (playlistId) => {
    if (!window.confirm("정말로 이 플레이리스트를 삭제하시겠습니까?")) {
      return;
    }

    try {
      // 백엔드에 삭제 API가 없어서 임시로 프론트엔드에서만 제거
      // 실제로는 DELETE /api/playlists/{playlistId} API가 필요함
      setPlaylists(playlists.filter((p) => p.playlist_id !== playlistId));
      alert("플레이리스트가 삭제되었습니다.");
    } catch (err) {
      alert("❌ 삭제 실패: " + err.message);
    }
  };

  if (loading) {
    return (
        <div className="playlist-page">
          <div className="loading">로딩 중...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="playlist-page">
          <div className="error">오류가 발생했습니다: {error}</div>
          <button onClick={fetchPlaylists}>다시 시도</button>
        </div>
    );
  }

  return (
      <div className="playlist-page">
        <h1>🎵 내 플레이리스트</h1>

        <div className="playlist-form">
          <input
              type="text"
              placeholder="플레이리스트 이름"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd}>추가</button>
        </div>

        <div className="playlist-list">
          {playlists.length === 0 ? (
              <p>플레이리스트가 없습니다. 새로운 플레이리스트를 만들어보세요!</p>
          ) : (
              playlists.map((playlist) => (
                  <div key={playlist.playlist_id} className="playlist-card">
                    <Link to={`/playlist/${playlist.playlist_id}`}>
                      <h2>{playlist.playlist_name}</h2>
                    </Link>
                    <p>생성일: {new Date(playlist.added_at).toLocaleDateString()}</p>
                    <button onClick={() => handleDelete(playlist.playlist_id)}>삭제</button>
                  </div>
              ))
          )}
        </div>
      </div>
  );
}

export default Playlist;