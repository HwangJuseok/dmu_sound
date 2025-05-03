import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.css';
import Sidebar from './components/Sidebar';
import MainPage from './pages/MainPage';
import Chart from './pages/Chart';
import Playlist from './pages/Playlist';

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
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chart" element={<Chart />} />
          <Route path="/playlist" element={<Playlist />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
