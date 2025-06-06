import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/MyPageRecommendations.css';

const MyPageRecommendations = () => {
  const { user, loading, checkAuthStatus } = useAuth();
  const userCode = user?.usercode;
  
  const [tracks, setTracks] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState(null);

  // API 기본 URL 설정
  const API_BASE_URL = 'http://localhost:8080';

  // 디버깅용 - 인증 상태 로그
  useEffect(() => {
    console.log('🎵 MyPageRecommendations Component - Auth State:');
    console.log('- User:', user);
    console.log('- User ID:', user?.userId);
    console.log('- User Code:', userCode);
    console.log('- Auth Loading:', loading);
    console.log('- Is User Valid:', !!(user && user.userId && userCode));

    if (checkAuthStatus) {
      checkAuthStatus();
    }
  }, [user, loading, userCode, checkAuthStatus]);

  // 컴포넌트 마운트 시 추천 트랙 로드
  useEffect(() => {
    if (loading) {
      console.log('⏳ Waiting for auth to complete...');
      return;
    }

    if (user && user.userId && userCode) {
      console.log('✅ User authenticated, fetching recommendations...');
      fetchRecommendations();
    } else {
      console.log('❌ User not authenticated:', { user, userCode });
      setDataLoading(false);
    }
  }, [user, userCode, loading]);

  // API 호출 함수
  const fetchRecommendations = async () => {
    try {
      setDataLoading(true);
      setError(null);
      
      console.log('📡 Fetching recommendations for userCode:', userCode);
      
      const response = await fetch(`${API_BASE_URL}/api/mypage/recommend?userCode=${userCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          // 추천 트랙이 없는 경우
          console.log('📝 No recommendations found for user');
          setTracks([]);
          return;
        }
        throw new Error(`추천 트랙 조회 실패: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Recommendations fetched:', data);
      setTracks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('❌ 추천 트랙 조회 오류:', err);
      setError(err.message);
      setTracks([]);
    } finally {
      setDataLoading(false);
    }
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    if (userCode) {
      fetchRecommendations();
    }
  };

  // 트랙 재생 핸들러 (실제 구현 시 Spotify Web API 또는 다른 플레이어 연동)
  const handlePlayTrack = (track) => {
    console.log('Playing track:', track);
    // 실제 재생 로직 구현
  };

  // 밀리초를 분:초 형태로 변환
  const formatDuration = (ms) => {
    if (!ms) return '--:--';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // 인증 로딩 중
  if (loading) {
    return (
      <div className="mypage-recommendations">
        <div className="mypage-recommendations-header">
          <div className="mypage-recommendations-header-content">
            <div className="mypage-recommendations-header-left">
              <div className="mypage-recommendations-header-icon">
                <div className="mypage-recommendations-icon-circle"></div>
              </div>
              <div>
                <h1 className="mypage-recommendations-title">나의 추천 트랙</h1>
                <p className="mypage-recommendations-subtitle">ACR 기반 개인화된 음악 추천</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mypage-recommendations-container">
          <div className="mypage-recommendations-loading-center">
            <span className="mypage-recommendations-loading-text">인증 상태 확인 중...</span>
          </div>
        </div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user || !user.userId || !userCode) {
    console.log('🚫 Rendering login required - User state:', { user, userCode });
    return (
      <div className="mypage-recommendations">
        {/* 헤더 */}
        <div className="mypage-recommendations-header">
          <div className="mypage-recommendations-header-content">
            <div className="mypage-recommendations-header-left">
              <div className="mypage-recommendations-header-icon">
                <div className="mypage-recommendations-icon-circle"></div>
              </div>
              <div>
                <h1 className="mypage-recommendations-title">나의 추천 트랙</h1>
                <p className="mypage-recommendations-subtitle">ACR 기반 개인화된 음악 추천</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mypage-recommendations-container">
          {/* 로그인 필요 메시지 */}
          <div className="mypage-recommendations-login-required">
            <div className="mypage-recommendations-login-content">
              <div className="mypage-recommendations-login-icon-wrapper">
                <div className="mypage-recommendations-login-icon">
                  <svg className="mypage-recommendations-user-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="mypage-recommendations-login-title">
                로그인이 필요합니다
              </h3>
              <p className="mypage-recommendations-login-description">
                개인화된 음악 추천을 받으려면 먼저 로그인해주세요.
              </p>
              
              {/* 디버그 정보 */}
              <div className="mypage-recommendations-debug-info">
                <div className="mypage-recommendations-debug-title">디버그 정보:</div>
                <div>- User: {user ? 'exists' : 'null'}</div>
                <div>- UserId: {user?.userId || 'null'}</div>
                <div>- UserCode: {userCode || 'null'}</div>
                <div>- Loading: {loading ? 'true' : 'false'}</div>
              </div>

              {/* 로그인 버튼들 */}
              <div className="mypage-recommendations-login-buttons">
                <Link to="/auth/login" className="mypage-recommendations-btn mypage-recommendations-btn-primary">
                  로그인
                </Link>
                <Link to="/auth/register" className="mypage-recommendations-btn mypage-recommendations-btn-secondary">
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-recommendations">
      {/* 헤더 */}
      <div className="mypage-recommendations-header">
        <div className="mypage-recommendations-header-content">
          <div className="mypage-recommendations-header-left">
            <div className="mypage-recommendations-header-icon">
              <div className="mypage-recommendations-icon-circle"></div>
            </div>
            <div>
              <h1 className="mypage-recommendations-title">나의 추천 트랙</h1>
              <p className="mypage-recommendations-subtitle">ACR 기반 개인화된 음악 추천</p>
            </div>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={dataLoading}
            className={`mypage-recommendations-btn mypage-recommendations-btn-primary ${dataLoading ? 'mypage-recommendations-btn-disabled' : ''}`}
          >
            {dataLoading ? "로딩 중..." : "새로고침"}
          </button>
        </div>
      </div>

      <div className="mypage-recommendations-container">
        {/* 사용자 정보 표시 */}
        {/* <div className="mypage-recommendations-user-info">
          <span className="mypage-recommendations-user-info-text">
            사용자: {user.userId} (코드: {userCode})
          </span>
          <div className="mypage-recommendations-auth-status">
            인증 상태: ✅ 로그인됨
          </div>
        </div> */}

        {/* 로딩 상태 */}
        {dataLoading && (
          <div className="mypage-recommendations-loading-center">
            <div className="mypage-recommendations-spinner"></div>
            <span className="mypage-recommendations-loading-text">추천 트랙을 불러오는 중...</span>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="mypage-recommendations-error-box">
            <span className="mypage-recommendations-error-title">오류 발생</span>
            <p className="mypage-recommendations-error-message">{error}</p>
            <button
              onClick={handleRefresh}
              className="mypage-recommendations-error-retry"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* 트랙 리스트 */}
        {!dataLoading && !error && tracks.length > 0 && (
          <div className="mypage-recommendations-tracks-section">
            <div className="mypage-recommendations-tracks-header">
              <h2 className="mypage-recommendations-tracks-title">
                추천 트랙 ({tracks.length}개)
              </h2>
            </div>
            
            <div className="mypage-recommendations-tracks-container">
              {tracks.map((track, index) => (
                    <div
                      key={track.id || index}
                      className="mypage-recommendations-track-item"
                    >
                      {/* 앨범 이미지 */}
                      <div className="mypage-recommendations-album-image">
                        {track.albumImageUrl || track.imageUrl ? (
                          <img
                            src={track.albumImageUrl || track.imageUrl}
                            alt={track.albumName || track.album || '앨범'}
                            className="mypage-recommendations-album-img"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="mypage-recommendations-album-placeholder">
                            <svg className="mypage-recommendations-music-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* 트랙 정보 */}
                      <div className="mypage-recommendations-track-info">
                        <h3 className="mypage-recommendations-track-name">
                          {track.trackName || track.name || '제목 없음'}
                        </h3>
                        <p className="mypage-recommendations-track-artist">
                          {/* artistName (문자열) 또는 artists (배열) 처리 */}
                          {track.artistName || 
                          (Array.isArray(track.artists) ? track.artists.join(', ') : track.artists) || 
                          '아티스트 정보 없음'}
                        </p>
                        <p className="mypage-recommendations-track-album">
                          {track.albumName || track.album || '앨범 정보 없음'}
                        </p>
                      </div>

                      {/* 재생 시간 */}
                      <div className="mypage-recommendations-track-controls">
                        <span className="mypage-recommendations-track-duration">
                          {formatDuration(track.durationMs || track.duration)}
                        </span>
                        
                        <button
                          onClick={() => handlePlayTrack(track)}
                          className="mypage-recommendations-play-btn"
                          title="재생"
                        >
                          ▶️
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* 데이터 없음 상태 */}
        {!dataLoading && !error && tracks.length === 0 && (
          <div className="mypage-recommendations-empty-state">
            <div className="mypage-recommendations-empty-icon">
              <svg className="mypage-recommendations-music-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 className="mypage-recommendations-empty-title">
              추천 트랙이 없습니다
            </h3>
            <p className="mypage-recommendations-empty-description">
              ACR 데이터를 기반으로 한 추천 트랙이 아직 없습니다.
            </p>
            <button
              onClick={handleRefresh}
              className="mypage-recommendations-empty-retry"
            >
              다시 확인하기
            </button>
          </div>
        )}

        {/* 홈으로 돌아가기 */}
        <div className="mypage-recommendations-back-to-home">
          <Link to="/" className="mypage-recommendations-home-link">
            ← 홈으로
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyPageRecommendations;