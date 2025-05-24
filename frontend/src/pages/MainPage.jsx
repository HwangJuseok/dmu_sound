import React, { useState, useEffect } from 'react';
import SearchBar from "../components/SearchBar";
import Section from "../components/Section";
import "../styles/MainPage.css";

// API 서비스
const API_BASE_URL = 'http://localhost:8080';

const apiService = {
    getNewReleases: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/spotify/new-releases`);
            if (!response.ok) throw new Error('Failed to fetch new releases');
            return await response.json();
        } catch (error) {
            console.error('Error fetching new releases:', error);
            return [];
        }
    },

    getTrendingVideos: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/youtube/trending`);
            if (!response.ok) throw new Error('Failed to fetch trending videos');
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
const Header = ({ onSearch }) => {
    return (
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                {/* 상단 라인: 로고와 로그인/회원가입 버튼 */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎵</span>
                        <h1 className="text-2xl font-bold">DMU Sound</h1>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
                            <span>👤</span>
                            <span>로그인</span>
                        </button>
                        <button className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
                            <span>➕</span>
                            <span>회원가입</span>
                        </button>
                    </nav>
                </div>

                {/* 중앙 라인: 제목과 설명 */}
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold mb-2">음악의 모든 것이 여기에</h2>
                    <p className="text-lg opacity-90">최신 음악부터 인기 차트까지, DMU Sound에서 만나보세요</p>
                </div>

                {/* 하단 라인: 검색바 */}
                <div className="flex justify-center">
                    <SearchBar onSearch={onSearch} />
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

    // 더미 데이터 (개발/테스트용)
    const dummySpotifyData = [
        {
            albumName: "IU 5th Album 'LILAC'",
            artistName: "아이유(IU)",
            imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
        },
        {
            albumName: "Map of the Soul: 7",
            artistName: "BTS",
            imageUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop"
        },
        {
            albumName: "The Album",
            artistName: "BLACKPINK",
            imageUrl: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop"
        },
        {
            albumName: "NewJeans Get Up",
            artistName: "NewJeans",
            imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop"
        },
        {
            albumName: "MY WORLD",
            artistName: "aespa",
            imageUrl: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop"
        }
    ];

    const dummyYouTubeData = [
        {
            title: "NewJeans (뉴진스) 'Get Up' Official MV",
            channel: "HYBE LABELS",
            thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop"
        },
        {
            title: "(G)I-DLE - 'Queencard' Official Music Video",
            channel: "(G)I-DLE (여자)아이들",
            thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
        },
        {
            title: "aespa 'Spicy' MV",
            channel: "SMTOWN",
            thumbnailUrl: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop"
        },
        {
            title: "IVE 'I AM' Official MV",
            channel: "IVE",
            thumbnailUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop"
        },
        {
            title: "LE SSERAFIM 'UNFORGIVEN' MV",
            channel: "HYBE LABELS",
            thumbnailUrl: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop"
        }
    ];

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);

            try {
                // 실제 API 호출 시도, 실패하면 더미 데이터 사용
                const [spotifyData, youtubeData] = await Promise.allSettled([
                    apiService.getNewReleases(),
                    apiService.getTrendingVideos()
                ]);

                setNewReleases(
                    spotifyData.status === 'fulfilled' && spotifyData.value.length > 0
                        ? spotifyData.value
                        : dummySpotifyData
                );

                setTrendingVideos(
                    youtubeData.status === 'fulfilled' && youtubeData.value.length > 0
                        ? youtubeData.value
                        : dummyYouTubeData
                );
            } catch (err) {
                // 에러 시 더미 데이터 사용
                setNewReleases(dummySpotifyData);
                setTrendingVideos(dummyYouTubeData);
                console.error('Error loading data, using dummy data:', err);
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
                <Header onSearch={handleSearch} />
                <main className="container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">데이터를 불러오는 중...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Header onSearch={handleSearch} />

            <main className="container mx-auto px-4 py-8">
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
                    <div>
                        <Section
                            title="📀 신곡 추천 (Spotify)"
                            songs={newReleases}
                            icon={null}
                        />
                        <Section
                            title="🔥 인기 음악 (YouTube)"
                            songs={trendingVideos}
                            icon={null}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default MainPage;