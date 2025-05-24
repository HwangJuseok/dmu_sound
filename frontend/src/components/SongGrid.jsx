import React from "react";
import SongCard from "./SongCard";
import { dummySongs } from "../utils/dummyData";
import "../styles/components/SongGrid.css";


// function SongGrid() {
//   return (
//     <div className="song-grid">
//       {dummySongs.map((song, idx) => (
//         <SongCard key={idx} song={song} />
//       ))}
//     </div>
//   );
// }

const SongGrid = ({ songs }) => {
    return (
        <div className="song-grid">
            {songs.map((song, idx) => (
                <div key={idx} className="song-item">
                    <SongCard song={song} />
                </div>
            ))}
        </div>
    );
};

export default SongGrid;