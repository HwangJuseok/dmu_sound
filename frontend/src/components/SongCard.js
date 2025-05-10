import React from "react";
import '../styles/components/SongCard.css';
import { Link } from "react-router-dom";
function SongCard({ song }) {
  return (
    <div className="song-card">
      <Link to={`/detail/${song.id}`}>
        <h2>{song.title}</h2>
        <p>{song.artist}</p>
      </Link>
    </div>
  );
}
export default SongCard;