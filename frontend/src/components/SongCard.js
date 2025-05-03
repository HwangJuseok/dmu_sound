import React from "react";
import '../styles/components/SongCard.css';

function SongCard({ title, artist }) {
  return (
    <div className="song-card">
      <div className="cover" />
      <p className="title">{title}</p>
      <p className="artist">{artist}</p>
    </div>
  );
}

export default SongCard;