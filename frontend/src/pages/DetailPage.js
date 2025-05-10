import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyChart } from "../utils/dummyData";
import MusicInfo from "../components/MusicInfo";

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const song = dummyChart.find((s) => s.id === parseInt(id));

  const [showMore, setShowMore] = useState(false); // 🔥 토글 상태

  if (!song) return <p>노래를 찾을 수 없습니다.</p>;

  return (
    <div className="detail-page">
      <h1>{song.title} - {song.artist}</h1>
      <img
        src={song.cover}
        alt={song.title}
        onClick={() => navigate(`/lyrics/${song.id}`)}
        style={{ cursor: "pointer", width: "200px", borderRadius: "10px" }}
      />
      
      {/* 기본 정보 표시 */}
      <div className="basic-info">
        <p><strong>앨범:</strong> {song.album || "앨범 정보 없음"}</p>
        <p><strong>가수:</strong> {song.artist}</p>
      </div>

      {/* 상세 정보 버튼 */}
      <button 
        onClick={() => setShowMore(!showMore)} 
        style={{ marginTop: "10px" }}
      >
        {showMore ? "간단히 보기" : "상세 정보"}
      </button>

      {/* 상세 정보 영역 */}
      {showMore && (
        <div className="more-info" style={{ marginTop: "10px", borderTop: "1px solid #ccc", paddingTop: "10px" }}>
          <MusicInfo info={song.info} />
        </div>
      )}
    </div>
  );
}

export default DetailPage;
