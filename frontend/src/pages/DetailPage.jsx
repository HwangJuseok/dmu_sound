import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { dummyChart } from "../utils/dummyData";

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const song = dummyChart.find((s) => s.id === parseInt(id));

  const [showMore, setShowMore] = useState(false); // 🔥 토글 상태

  if (!song) return <p>노래를 찾을 수 없습니다.</p>;

  return (
    <div className="detail-page">
      
      
      {/* 기본 정보 표시 */}
      <div style={{ padding: "40px" }}>
      <h1>{song.title}</h1>
      <p><strong>아티스트:</strong> {song.artist}</p>
      <p><strong>앨범:</strong> {song.album}</p>
      <img src={song.image} alt={song.title} style={{ width: "300px", borderRadius: "12px" }} />
      <p><strong>정보:</strong> {song.info || "비어있음"}</p>
    </div>

    </div>
  );
}

export default DetailPage;