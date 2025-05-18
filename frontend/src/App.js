import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
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
function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="App">
      {sidebarOpen && <Sidebar onToggle={() => setSidebarOpen(false)} />}

      {!sidebarOpen && (
        <button className="sidebar-toggle-button" onClick={() => setSidebarOpen(true)}>
          ☰
        </button>
      )}

      <main className="main-page">
        <header className="search-bar-wrapper">
          <SearchBar />
        </header>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/playlist" element={<Playlist />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/music/:id" element={<MusicInfo />} />
          <Route path="/detail/:id" element={<DetailPage />} />
          <Route path="/lyrics/:id" element={<LyricsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;