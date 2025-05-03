import React from "react";
import SongCard from "./SongCard";
import { dummySongs } from "../utils/dummyData";

function SongGrid() {
  return (
    <div className="song-grid">
      {dummySongs.map((song, idx) => (
        <SongCard key={idx} title={song.title} artist={song.artist} />
      ))}
    </div>
  );
}

export default SongGrid;