import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from "../components/SearchBar";
import Section from "../components/Section";
import { useAuth } from "../contexts/AuthContext";
import "../styles/MainPage.css";

// API 서비스
const API_BASE_URL = 'http://localhost:8080';

const apiService = {
    getNewReleases: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/spotify/new-releases`);
            if (!response.ok) throw new Error(`Failed to fetch new releases: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching new releases:', error);
            return [];
        }
    },

    getTrendingVideos: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/youtube/trending`);
            if (!response.ok) throw new Error(`Failed to fetch trending videos: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching trending videos:', error);
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

// Header 컴포넌트
const Header = ({ onSearch, user, logout, loading }) => {
    const navigate = useNavigate();

    return (
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎵</span>
                        <h1 className="text-2xl font-bold">DMU Sound</h1>
                    </div>
                    <nav className="flex items-center space-x-4">
                        {loading ? (
                            // 로딩 중일 땐 아무것도 안 보여줌
                            null
                        ) : user ? (
                            <>
                                <span className="text-white font-semibold">👋 {user.userId}</span>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                                    onClick={() => navigate('/auth/login')}
                                >
                                    <span>👤</span>
                                    <span>로그인</span>
                                </button>
                                <button
                                    className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white bg-opacity-30 transition-all"
                                    onClick={() => navigate('/auth/register')}
                                >
                                    <span>➕</span>
                                    <span>회원가입</span>
                                </button>
                            </>
                        )}

                    </nav>
                </div>

                <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold mb-2">음악의 모든 것이 여기에</h2>
                    <p className="text-lg opacity-90">최신 음악부터 인기 차트까지, DMU Sound에서 만나보세요</p>
                </div>

                <div className="flex justify-center">
                    <SearchBar onSearch={onSearch}/>
                </div>
            </div>
        </header>
    );
};

const MainPage = () => {
    const [newReleases, setNewReleases] = useState([]);
    const [trendingVideos, setTrendingVideos] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, logout, loading } = useAuth(); // ✅ 여기에 추가



    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [spotifyResponse, youtubeResponse] = await Promise.all([
                    apiService.getNewReleases(),
                    apiService.getTrendingVideos()
                ]);
                setNewReleases(spotifyResponse || []);
                setTrendingVideos(youtubeResponse || []);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('데이터를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const handleSearch = (results, query) => {
        setSearchResults(results);
        setSearchQuery(query);
    };

    const clearSearch = () => {
        setSearchResults(null);
        setSearchQuery('');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header onSearch={handleSearch} user={user} logout={logout} loading={loading} />
                <main className="mx-auto px-4 py-8 max-w-7xl w-full">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">데이터를 불러오는 중...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Header onSearch={handleSearch} user={user} logout={logout} loading={loading} />
                <main className="mx-auto px-4 py-8 max-w-7xl w-full">
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
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header onSearch={handleSearch} user={user} logout={logout} loading={loading} />
            <main className="mx-auto px-4 py-8 max-w-7xl w-full">
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
                        <Section
                            title={`"${searchQuery}" 검색 결과 (${searchResults.length}개)`}
                            songs={searchResults}
                            icon={null}
                        />
                    </div>
                ) : (
                    <>
                        {newReleases.length > 0 && (
                            <Section title="📀 신곡 추천 (Spotify)" songs={newReleases} icon={null} />
                        )}
                        {trendingVideos.length > 0 && (
                            <Section title="🔥 인기 음악 (YouTube)" songs={trendingVideos} icon={null} />
                        )}
                        {newReleases.length === 0 && trendingVideos.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🎵</div>
                                <p className="text-gray-600 text-lg">데이터가 없습니다.</p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default MainPage;
