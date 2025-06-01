import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import "../styles/MainPage.css";
// API 서비스 통합
const API_BASE_URL = 'http://localhost:8080';

const apiService = {
    // 기존 컨트롤러와 연결된 API들
    getNewReleases: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/spotify/new-releases`);
            if (!response.ok) throw new Error(`Failed to fetch new releases: ${response.status}`);
            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error('Error fetching new releases:', error);
            return [];
        }
    },

    getTrendingVideos: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/youtube/trending`);
            if (!response.ok) throw new Error(`Failed to fetch trending videos: ${response.status}`);
            const data = await response.json();
            return data || [];
        } catch (error) {
            console.error('Error fetching trending videos:', error);
            return [];
        }
    },

    // 사용자별 데이터 API들 (로그인한 경우에만 사용)
    getRecentMusic: async () => {
        try {
            const response = await fetch('/api/music/recent', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                return data.slice(0, 6);
            }
            return [];
        } catch (error) {
            console.error('최근 음악 로딩 실패:', error);
            return [];
        }
    },

    getUserPlaylists: async () => {
        try {
            // localStorage 먼저 확인
            const stored = localStorage.getItem('myPlaylists');
            let playlists = [];

            if (stored) {
                playlists = JSON.parse(stored).slice(0, 4);
            }

            // 서버에서도 가져오기
            const response = await fetch('/api/playlists/my', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                playlists = data.slice(0, 4);
                localStorage.setItem('myPlaylists', JSON.stringify(data));
            }

            return playlists;
        } catch (error) {
            console.error('플레이리스트 로딩 실패:', error);
            return [];
        }
    },

    getRecommendations: async () => {
        try {
            const response = await fetch('/api/music/recommendations', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                return data.slice(0, 8);
            }
            return [];
        } catch (error) {
            console.error('추천 음악 로딩 실패:', error);
            return [];
        }
    },

    searchMusic: async (query) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Failed to search music');
            return await response.json();
        } catch (error) {
            console.error('Error searching music:', error);
            return [];
        }
    }
};

const MainPage = ({ user, logout, loading }) => {
    // 상태 관리
    const [newReleases, setNewReleases] = useState([]);
    const [trendingVideos, setTrendingVideos] = useState([]);
    const [recentMusic, setRecentMusic] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // 데이터 로딩
    useEffect(() => {
        const loadData = async () => {
            setIsLoadingData(true);
            setError(null);

            try {
                // 공통 데이터 (로그인 여부와 상관없이)
                const [spotifyData, youtubeData] = await Promise.all([
                    apiService.getNewReleases(),
                    apiService.getTrendingVideos()
                ]);

                setNewReleases(spotifyData);
                setTrendingVideos(youtubeData);

                // 로그인한 사용자만의 데이터
                if (user) {
                    const [recentData, playlistData, recommendationData] = await Promise.all([
                        apiService.getRecentMusic(),
                        apiService.getUserPlaylists(),
                        apiService.getRecommendations()
                    ]);

                    setRecentMusic(recentData);
                    setUserPlaylists(playlistData);
                    setRecommendations(recommendationData);
                }
            } catch (err) {
                console.error('Error loading data:', err);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoadingData(false);
            }
        };

        loadData();
    }, [user, loading]);

    // 이벤트 핸들러
    const handleSearch = (results, query) => {
        setSearchResults(results);
        setSearchQuery(query);
    };

    const clearSearch = () => {
        setSearchResults(null);
        setSearchQuery('');
    };

    const handleMusicClick = (musicId) => {
        navigate(`/music/${musicId}`);
    };

    const handlePlaylistClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    };

    // 로딩 상태
    if (loading || isLoadingData) {
        return (
            <div className="main-page-loading">
                <h2>로딩 중...</h2>
            </div>
        );
    }

    // 에러 상태
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <div className="text-center py-12">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-gray-600 text-lg mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="main-page-content">
            {/* 메인 헤더 */}
            <header className="main-header">
                <div className="header-content">
                    <div className="logo-section">
                        <h1>dmu_sound</h1>
                        <p>음악을 발견하고 공유하세요</p>
                    </div>

                    {/* 메인 검색바 */}
                    <div className="main-search-section">
                        <SearchBar
                            placeholder="아티스트, 곡명, 앨범을 검색하세요..."
                            onSearch={handleSearch}
                        />
                    </div>

                    {/* 사용자 정보 */}
                    <div className="user-status">
                        {user ? (
                            <div className="user-info">
                                <span className="welcome-text">환영합니다, {user.userId}님!</span>
                                <button onClick={logout} className="logout-btn">로그아웃</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/auth/login" className="login-btn">로그인</Link>
                                <Link to="/auth/register" className="register-btn">회원가입</Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 메인 콘텐츠 */}
            <main className="main-content">
                {/* 검색 결과가 있을 때 */}
                {searchResults ? (
                    <div>
                        <div className="mb-6">
                            <button
                                onClick={clearSearch}
                                className="px-4 py-2 text-purple-600 hover:text-purple-800 font-medium"
                            >
                                ← 홈으로 돌아가기
                            </button>
                        </div>
                        <section className="music-section">
                            <div className="section-header">
                                <h2>🔍 "{searchQuery}" 검색 결과 ({searchResults.length}개)</h2>
                            </div>
                            <div className="music-grid">
                                {searchResults.map((music, index) => (
                                    <div
                                        key={music.id || index}
                                        className="music-card"
                                        onClick={() => handleMusicClick(music.id)}
                                    >
                                        <div className="music-info">
                                            <img
                                                src={music.albumArt || music.image || '/default-album.jpg'}
                                                alt={music.title}
                                                className="album-art"
                                            />
                                            <div className="music-details">
                                                <h4>{music.title}</h4>
                                                <p>{music.artist}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                ) : (
                    <>
                        {/* 환영 메시지 (간단한 소개) */}
                        <section className="welcome-banner">
                            <div className="welcome-content-simple">
                                <h2>🎵 음악의 모든 것이 여기에</h2>
                                <p>최신 음악부터 인기 차트까지, DMU Sound에서 만나보세요</p>
                            </div>
                        </section>

                        {isLoadingData ? (
                            <div className="content-loading">
                                <p>콘텐츠를 불러오는 중...</p>
                            </div>
                        ) : (
                            <>
                                {/* 신곡 추천 (Spotify) */}
                                {newReleases.length > 0 && (
                                    <section className="music-section">
                                        <div className="section-header">
                                            <h2>📀 신곡 추천 (Spotify)</h2>
                                        </div>
                                        <div className="music-grid">
                                            {newReleases.slice(0, 10).map((music, index) => (
                                                <div
                                                    key={music.id || index}
                                                    className="music-card"
                                                    onClick={() => handleMusicClick(music.id)}
                                                >
                                                    <div className="music-info">
                                                        <img
                                                            src={music.image || '/default-album.jpg'}
                                                            alt={music.title}
                                                            className="album-art"
                                                        />
                                                        <div className="music-details">
                                                            <h4>{music.title}</h4>
                                                            <p>{music.artist}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* 인기 음악 (YouTube) */}
                                {trendingVideos.length > 0 && (
                                    <section className="music-section">
                                        <div className="section-header">
                                            <h2>🔥 인기 음악 (YouTube)</h2>
                                        </div>
                                        <div className="music-grid">
                                            {trendingVideos.slice(0, 10).map((music, index) => (
                                                <div
                                                    key={music.id || index}
                                                    className="music-card"
                                                    onClick={() => handleMusicClick(music.id)}
                                                >
                                                    <div className="music-rank">{index + 1}</div>
                                                    <div className="music-info">
                                                        <img
                                                            src={music.thumbnailUrl || '/default-album.jpg'}
                                                            alt={music.title}
                                                            className="album-art"
                                                        />
                                                        <div className="music-details">
                                                            <h4>{music.title}</h4>
                                                            <p>{music.artist}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* 로그인한 사용자 전용 섹션들 */}
                                {user && (
                                    <>
                                        {/* 최근 들은 음악 */}
                                        {recentMusic.length > 0 && (
                                            <section className="music-section">
                                                <div className="section-header">
                                                    <h2>🕒 최근 들은 음악</h2>
                                                </div>
                                                <div className="music-horizontal-list">
                                                    {recentMusic.map((music, index) => (
                                                        <div
                                                            key={music.id || index}
                                                            className="music-item"
                                                            onClick={() => handleMusicClick(music.id)}
                                                        >
                                                            <img
                                                                src={music.albumArt || '/default-album.jpg'}
                                                                alt={music.title}
                                                                className="album-art-small"
                                                            />
                                                            <div className="music-info-small">
                                                                <h5>{music.title || `최근곡 ${index + 1}`}</h5>
                                                                <p>{music.artist || '아티스트'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* 내 플레이리스트 */}
                                        {userPlaylists.length > 0 && (
                                            <section className="playlist-section">
                                                <div className="section-header">
                                                    <h2>🎵 내 플레이리스트</h2>
                                                    <Link to="/playlist" className="see-more-btn">전체보기</Link>
                                                </div>
                                                <div className="playlist-grid">
                                                    {userPlaylists.map((playlist, index) => (
                                                        <div
                                                            key={playlist.id || index}
                                                            className="playlist-card"
                                                            onClick={() => handlePlaylistClick(playlist.id)}
                                                        >
                                                            <div className="playlist-cover">
                                                                <span className="playlist-icon">🎵</span>
                                                            </div>
                                                            <div className="playlist-info">
                                                                <h4>{playlist.name || `플레이리스트 ${index + 1}`}</h4>
                                                                <p>{playlist.songCount || 0}곡</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {/* 추천 음악 */}
                                        {recommendations.length > 0 && (
                                            <section className="music-section">
                                                <div className="section-header">
                                                    <h2>✨ {user.userId}님을 위한 추천</h2>
                                                </div>
                                                <div className="music-grid">
                                                    {recommendations.map((music, index) => (
                                                        <div
                                                            key={music.id || index}
                                                            className="music-card recommendation"
                                                            onClick={() => handleMusicClick(music.id)}
                                                        >
                                                            <div className="music-info">
                                                                <img
                                                                    src={music.albumArt || '/default-album.jpg'}
                                                                    alt={music.title}
                                                                    className="album-art"
                                                                />
                                                                <div className="music-details">
                                                                    <h4>{music.title || `추천곡 ${index + 1}`}</h4>
                                                                    <p>{music.artist || '아티스트'}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </>
                                )}

                                {/* 비로그인 사용자용 환영 섹션 */}
                                {!user && (
                                    <section className="welcome-section">
                                        <div className="welcome-content">
                                            <h2>dmu_sound에 오신 것을 환영합니다!</h2>
                                            <p>로그인하여 개인화된 음악 경험을 시작하세요</p>

                                            <div className="welcome-features">
                                                <div className="feature-item">
                                                    <span className="feature-icon">🎵</span>
                                                    <div className="feature-text">
                                                        <h4>개인 플레이리스트</h4>
                                                        <p>좋아하는 음악으로 플레이리스트를 만들어보세요</p>
                                                    </div>
                                                </div>
                                                <div className="feature-item">
                                                    <span className="feature-icon">❤️</span>
                                                    <div className="feature-text">
                                                        <h4>음악 저장</h4>
                                                        <p>마음에 드는 음악을 저장하고 언제든 들어보세요</p>
                                                    </div>
                                                </div>
                                                <div className="feature-item">
                                                    <span className="feature-icon">🎯</span>
                                                    <div className="feature-text">
                                                        <h4>맞춤 추천</h4>
                                                        <p>취향에 맞는 음악을 추천받아보세요</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="cta-buttons">
                                                <Link to="/auth/register" className="cta-primary">무료로 시작하기</Link>
                                                <Link to="/auth/login" className="cta-secondary">로그인</Link>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* 데이터가 없을 때 */}
                                {newReleases.length === 0 && trendingVideos.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 text-6xl mb-4">🎵</div>
                                        <p className="text-gray-600 text-lg">데이터가 없습니다.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default MainPage;