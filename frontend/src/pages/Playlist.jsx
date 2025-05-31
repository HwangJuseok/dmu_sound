import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Playlist.css";

function Playlist() {
  const [playlists, setPlaylists] = useState([
    { id: 1, name: "내 플레이리스트 1", description: "설명 1" },
    { id: 2, name: "내 플레이리스트 2", description: "설명 2" },
  ]);

  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const handleAdd = () => {
    if (!newName) return;
    const newId = playlists.length > 0 ? playlists[playlists.length - 1].id + 1 : 1;
    const newPlaylist = { id: newId, name: newName, description: newDesc };
    setPlaylists([...playlists, newPlaylist]);
    setNewName("");
    setNewDesc("");
  };

  const handleDelete = (id) => {
    setPlaylists(playlists.filter((p) => p.id !== id));
  };

  return (
    <div className="playlist-page">
      <h1>🎵 내 플레이리스트</h1>

      <div className="playlist-form">
        <input
          type="text"
          placeholder="플레이리스트 이름"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="text"
          placeholder="설명"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
        <button onClick={handleAdd}>추가</button>
      </div>

      <div className="playlist-list">
        {playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <Link to={`/playlist/${playlist.id}`}>
              <h2>{playlist.name}</h2>
            </Link>
            <p>{playlist.description}</p>
            <button onClick={() => handleDelete(playlist.id)}>삭제</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;
