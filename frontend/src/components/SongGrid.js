import React from "react";
import SongCard from "./SongCard";
import { dummySongs } from "../utils/dummyData";

function SongGrid() {
  return (
    <div className="song-grid">
      {dummySongs.map((song, idx) => (
        <SongCard key={idx} song={song} />
      ))}
    </div>
  );
}

export default SongGrid;