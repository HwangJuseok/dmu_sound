import React, { useState, useEffect } from 'react';

const MyPageRecommendations = () => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userCode, setUserCode] = useState('USER001'); // 실제로는 로그인된 사용자 코드

  // API 호출 함수
  const fetchRecommendations = async (code) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/mypage/recommend?userCode=${code}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTracks(data);
    } catch (err) {
      setError(`추천 트랙을 불러오는데 실패했습니다: ${err.message}`);
      console.error('Failed to fetch recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    if (userCode) {
      fetchRecommendations(userCode);
    }
  }, [userCode]);

  // 새로고침 핸들러
  const handleRefresh = () => {
    fetchRecommendations(userCode);
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 rounded-full">
            <div className="w-6 h-6 bg-blue-600 rounded"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">나의 추천 트랙</h1>
            <p className="text-gray-600">ACR 기반 개인화된 음악 추천</p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          새로고침
        </button>
      </div>

      {/* 사용자 코드 표시 */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg">
        <span className="text-sm text-gray-600">사용자 코드: {userCode}</span>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <span className="text-gray-600">추천 트랙을 불러오는 중...</span>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <span className="text-red-800 font-medium">오류 발생</span>
          <p className="text-red-700 mt-2">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-3 text-red-600 hover:text-red-800 underline text-sm"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 트랙 리스트 */}
      {!loading && !error && tracks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              추천 트랙 ({tracks.length}개)
            </h2>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {tracks.map((track, index) => (
              <div
                key={track.id || index}
                className="flex items-center p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                {/* 앨범 이미지 */}
                <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex-shrink-0">
                  {track.albumImageUrl ? (
                    <img
                      src={track.albumImageUrl}
                      alt={track.albumName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg"></div>
                  )}
                </div>

                {/* 트랙 정보 */}
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {track.name || '제목 없음'}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    {track.artists?.join(', ') || '아티스트 정보 없음'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {track.albumName || '앨범 정보 없음'}
                  </p>
                </div>

                {/* 재생 시간 */}
                <div className="flex items-center space-x-3 text-sm text-gray-500 flex-shrink-0">
                  <span>{formatDuration(track.durationMs)}</span>
                  
                  <button
                    onClick={() => handlePlayTrack(track)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="재생"
                  >
                    재생
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 데이터 없음 상태 */}
      {!loading && !error && tracks.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            추천 트랙이 없습니다
          </h3>
          <p className="text-gray-600 mb-4">
            ACR 데이터를 기반으로 한 추천 트랙이 아직 없습니다.
          </p>
          <button
            onClick={handleRefresh}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            다시 확인하기
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPageRecommendations;