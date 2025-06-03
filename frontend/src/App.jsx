import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './styles/App.css';
import { AuthProvider } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import MainPage from './pages/MainPage';
import Chart from './pages/Chart';
import Playlist from './pages/Playlist';
import DetailPage from "./pages/DetailPage";
import LyricsPage from "./pages/LyricsPage";
import MusicInfo from './pages/MusicInfo';
import SearchResultsPage from './pages/SearchResultsPage';
import MyPageRecommendations from './pages/MyPageRecommendations';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const { user, logout, loading } = useAuth();

    // 인증 페이지 경로들
    const authPaths = ['/login', '/auth/login', '/register', '/auth/register'];
    const isAuthPage = authPaths.includes(location.pathname);

    return (
        <div className="App">
            {/* 인증 페이지가 아닐 때만 사이드바 표시 */}
            {!isAuthPage && (
                <>
                    {sidebarOpen && (
                        <Sidebar
                            onToggle={() => setSidebarOpen(false)}
                            user={user}
                            logout={logout}
                            loading={loading}
                        />
                    )}

                    {!sidebarOpen && (
                        <button
                            className="sidebar-toggle-button"
                            onClick={() => setSidebarOpen(true)}
                        >
                            ☰
                        </button>
                    )}
                </>
            )}

            <main className={`main-page ${isAuthPage ? 'auth-page' : ''}`}>
                <Routes>
                    <Route path="/" element={
                        <MainPage user={user} logout={logout} loading={loading} />
                    } />
                    <Route path="/chart" element={<Chart />} />
                    <Route path="/playlist" element={<Playlist />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="/music/:id" element={<MusicInfo />} />
                    <Route path="/detail/:id" element={<DetailPage />} />
                    <Route path="/lyrics/:id" element={<LyricsPage />} />
                    <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/auth/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/auth/register" element={<Register />} />
                    <Route path="mypagerecommendations" element={<MyPageRecommendations/>} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;