import React, {useEffect, useState} from 'react';
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
import SearchBar from './components/SearchBar';
import PlaylistDetailPage from './pages/PlaylistDetailPage';
import Login from './pages/Login';
import Register from './pages/Register';


function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
      <div className="App">
        {sidebarOpen && <Sidebar onToggle={() => setSidebarOpen(false)} user={user} />}

        {!sidebarOpen && (
            <button className="sidebar-toggle-button" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
        )}

        <main className="main-page">
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
            <Route path="/login" element={<Login />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/register" element={<Register />} />
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