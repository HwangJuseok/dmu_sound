import React from "react";
import { useParams } from "react-router-dom";
import { dummyChart } from "../utils/dummyData";
import "../styles/Lyrics.css"
function LyricsPage() {
  const { id } = useParams();
  const song = dummyChart.find((s) => s.id === parseInt(id));

  if (!song) return <p>노래를 찾을 수 없습니다.</p>;

  return (
    <div className="lyrics-page">
      <h1>{song.title} - {song.artist}</h1>
      <pre>{song.lyrics}</pre>
    </div>
  );
}

export default LyricsPage;
