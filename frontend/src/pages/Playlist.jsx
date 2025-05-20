import React from "react";
import "../styles/Playlist.css";

const samplePlaylists = [
  {
    id: 1,
    name: "내 플레이리스트1",
    description: "설명1",
  },
  {
    id: 2,
    name: "내 플레이리스트2",
    description: "설명2",
  },
  {
    id: 3,
    name: "내 플레이리스트3",
    description: "설명3",
  },
];

function Playlist() {
  return (
    <div className="playlist-page">
      <h1>🎵 플레이리스트</h1>
      <div className="playlist-list">
        {samplePlaylists.map((playlist) => (
          <div key={playlist.id} className="playlist-card">
            <h2 className="playlist-name">{playlist.name}</h2>
            <p className="playlist-description">{playlist.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlist;
