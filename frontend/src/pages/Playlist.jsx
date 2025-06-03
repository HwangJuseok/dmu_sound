import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Playlist.css";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "../components/SearchBar";

function Playlist() {
  const { user, loading, checkAuthStatus } = useAuth();
  const userCode = user?.usercode;
  const [playlists, setPlaylists] = useState([]);
  const [newName, setNewName] = useState("");
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null); // 삭제 중인 플레이리스트 ID

  // API 기본 URL 설정
  const API_BASE_URL = 'http://localhost:8080';

  // 디버깅용 - 인증 상태 로그
  useEffect(() => {
    console.log('🎵 Playlist Component - Auth State:');
    console.log('- User:', user);
    console.log('- User ID:', user?.userId);
    console.log('- User Code:', userCode);
    console.log('- Auth Loading:', loading);
    console.log('- Is User Valid:', !!(user && user.userId && userCode));

    if (checkAuthStatus) {
      checkAuthStatus();
    }
  }, [user, loading, userCode, checkAuthStatus]);

  // 컴포넌트 마운트 시 플레이리스트 목록 로드
  useEffect(() => {
    if (loading) {
      console.log('⏳ Waiting for auth to complete...');
      return;
    }

    if (user && user.userId && userCode) {
      console.log('✅ User authenticated, fetching playlists...');
      fetchPlaylists();
    } else {
      console.log('❌ User not authenticated:', { user, userCode });
      setDataLoading(false);
    }
  }, [user, userCode, loading]);

  // 플레이리스트 목록 조회
  const fetchPlaylists = async () => {
    try {
      setDataLoading(true);
      setError(null);

      console.log('📡 Fetching playlists for userCode:', userCode);

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
          console.log('📝 No playlists found for user');
          setPlaylists([]);
          return;
        }
        throw new Error(`플레이리스트 조회 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Playlists fetched:', data);
      setPlaylists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ 플레이리스트 조회 오류:', err);
      setError(err.message);
      setPlaylists([]);
    } finally {
      setDataLoading(false);
    }
  };

  const handleAdd = async () => {
    console.log('➕ Adding playlist - User state:', { user, userCode });

    if (!newName.trim()) {
      alert("플레이리스트 이름을 입력해주세요.");
      return;
    }

    // 더 자세한 사용자 인증 체크
    if (!user) {
      console.log('❌ No user object');
      alert("로그인이 필요합니다. (사용자 정보 없음)");
      return;
    }

    if (!user.userId) {
      console.log('❌ No userId in user object:', user);
      alert("로그인이 필요합니다. (사용자 ID 없음)");
      return;
    }

    if (!userCode) {
      console.log('❌ No userCode:', user);
      alert("로그인이 필요합니다. (사용자 코드 없음)");
      return;
    }

    if (isCreating) return; // 중복 생성 방지

    try {
      setIsCreating(true);
      const playlistData = {
        playlist_name: newName,
        user_code: userCode
      };

      console.log('📝 Creating playlist:', playlistData);

      const response = await fetch(`${API_BASE_URL}/api/playlists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(playlistData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const result = await response.text(); // 백엔드에서 문자열로 반환
      console.log('✅ Playlist created:', result);

      alert("✅ 플레이리스트가 생성되었습니다!");
      setNewName("");

      // 플레이리스트 목록 새로고침
      await fetchPlaylists();
    } catch (err) {
      console.error('❌ 플레이리스트 생성 오류:', err);
      alert("❌ 플레이리스트 생성 실패: " + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  // 실제 API를 호출하는 삭제 함수
  const handleDelete = async (playlistId, playlistName) => {
    if (!window.confirm(`정말로 "${playlistName}" 플레이리스트를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      setDeletingId(playlistId);
      console.log('🗑️ Deleting playlist:', playlistId);

      const response = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}?userCode=${userCode}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `삭제 실패: ${response.status}`);
      }

      const result = await response.text();
      console.log('✅ Playlist deleted:', result);

      alert("✅ 플레이리스트가 삭제되었습니다!");

      // 플레이리스트 목록 새로고침
      await fetchPlaylists();
    } catch (err) {
      console.error('❌ 플레이리스트 삭제 오류:', err);
      alert("❌ 삭제 실패: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // 인증 로딩 중
  if (loading) {
    return (
        <div className="playlist-page">
          <h1>🎵 내 플레이리스트</h1>
          <div className="loading">인증 상태 확인 중...</div>
        </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user || !user.userId || !userCode) {
    console.log('🚫 Rendering login required - User state:', { user, userCode });
    return (
        <div className="playlist-page">
          <h1>🎵 내 플레이리스트</h1>
          <div className="auth-required">
            <p>플레이리스트 기능을 사용하려면 로그인이 필요합니다.</p>
            <div className="debug-info" style={{
              background: '#f0f0f0',
              padding: '10px',
              margin: '10px 0',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              <div>디버그 정보:</div>
              <div>- User: {user ? 'exists' : 'null'}</div>
              <div>- UserId: {user?.userId || 'null'}</div>
              <div>- UserCode: {userCode || 'null'}</div>
              <div>- Loading: {loading ? 'true' : 'false'}</div>
            </div>
            <div className="auth-buttons">
              <Link to="/auth/login" className="login-btn">로그인</Link>
              <Link to="/auth/register" className="register-btn">회원가입</Link>
            </div>
          </div>
        </div>
    );
  }

  if (dataLoading) {
    return (
        <div className="playlist-page">
          <header className="playlist-header">
            <h1>🎵 내 플레이리스트</h1>
            <div className="chart-search-wrapper">
              <SearchBar
                  placeholder="아티스트, 곡명, 앨범을 검색하세요..."
                  onSearch={(query) => {
                    window.location.href = `/search?query=${encodeURIComponent(query)}`;
                  }}
              />
            </div>
            <div className="loading">플레이리스트 로딩 중...</div>
          </header>
        </div>
    );
  }

  if (error) {
    return (
        <div className="playlist-page">
          <header className="playlist-header">
            <h1>🎵 내 플레이리스트</h1>
            <div className="chart-search-wrapper">
              <SearchBar
                  placeholder="아티스트, 곡명, 앨범을 검색하세요..."
                  onSearch={(query) => {
                    window.location.href = `/search?query=${encodeURIComponent(query)}`;
                  }}
              />
            </div>
            <div className="error">
              <p>오류가 발생했습니다: {error}</p>
              <button onClick={fetchPlaylists} className="retry-btn">다시 시도</button>
            </div>
          </header>
        </div>
    );
  }

  return (
      <div className="playlist-page">
        <header className="playlist-header">
          <h1>🎵 내 플레이리스트</h1>
          <div className="chart-search-wrapper">
            <SearchBar
                placeholder="아티스트, 곡명, 앨범을 검색하세요..."
                onSearch={(query) => {
                  window.location.href = `/search?query=${encodeURIComponent(query)}`;
                }}
            />
          </div>
        </header>

        <div className="user-info">
          <p>사용자: {user.userId} (코드: {userCode})</p>
          <div
              className="debug-info"
              style={{
                background: "#e8f5e8",
                padding: "8px",
                margin: "8px 0",
                fontSize: "11px",
                fontFamily: "monospace",
                border: "1px solid #ccc",
              }}
          >
            인증 상태: ✅ 로그인됨
          </div>
        </div>

        <div className="playlist-form">
          <input
              type="text"
              placeholder="플레이리스트 이름"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAdd()}
              disabled={isCreating}
          />
          <button
              onClick={handleAdd}
              disabled={!newName.trim() || isCreating}
          >
            {isCreating ? "생성 중..." : "추가"}
          </button>
        </div>

        <div className="playlist-list">
          {playlists.length === 0 ? (
              <div className="empty-state">
                <p>플레이리스트가 없습니다. 새로운 플레이리스트를 만들어보세요!</p>
              </div>
          ) : (
              playlists.map((playlist) => (
                  <div key={playlist.playlist_id} className="playlist-card">
                    <Link
                        to={`/playlist/${playlist.playlist_id}`}
                        className="playlist-link"
                    >
                      <h2>{playlist.playlist_name}</h2>
                      <p>
                        생성일:{" "}
                        {playlist.added_at
                            ? new Date(playlist.added_at).toLocaleDateString()
                            : "알 수 없음"}
                      </p>
                    </Link>
                    <div className="playlist-actions">
                      <button
                          onClick={() => handleDelete(playlist.playlist_id, playlist.playlist_name)}
                          className="delete-btn"
                          disabled={deletingId === playlist.playlist_id}
                      >
                        {deletingId === playlist.playlist_id ? "삭제 중..." : "삭제"}
                      </button>
                    </div>
                  </div>
              ))
          )}
        </div>

        <div className="back-to-home">
          <Link to="/" className="home-link">
            ← 홈으로
          </Link>
        </div>
      </div>
  );
}

export default Playlist;