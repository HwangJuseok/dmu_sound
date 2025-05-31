import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './styles/App.css';
import Sidebar from './components/Sidebar';
import MainPage from './pages/MainPage';
import Chart from './pages/Chart';
import Playlist from './pages/Playlist';
import DetailPage from "./pages/DetailPage";
import LyricsPage from "./pages/LyricsPage";
import MusicInfo from './pages/MusicInfo';
import SearchResultsPage from './pages/SearchResultsPage';
import SearchBar from './components/SearchBar';
import PlaylistDetailPage from './pages/PlaylistDetailPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate('/');
  };

  return (
    <div className="App">
      {sidebarOpen && <Sidebar onToggle={() => setSidebarOpen(false)} user={user} />}

      {!sidebarOpen && (
        <button className="sidebar-toggle-button" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      )}

      <main className="main-page">

        {/* 현재 페이지가 '/'가 아닐 때만 SearchBar 렌더링 */}
        {location.pathname !== '/' && (
          <header className="search-bar-wrapper">
            <SearchBar />
          </header>
        )}

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/music/:id" element={<MusicInfo />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/lyrics/:id" element={<LyricsPage />} />
          <Route path="/playlist/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
