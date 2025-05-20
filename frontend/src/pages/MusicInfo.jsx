import React, { useState } from "react";
import { Link, useLocation, useParams  } from "react-router-dom";


const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#fff",
  border: "1px solid #999",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
};

const thumbnailStyle = {
  flex: "1 1 300px",
  minWidth: "250px",
  aspectRatio: "16 / 9",
  backgroundColor: "#888",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "10px",
  fontSize: "18px",
  position: "relative",
  overflow: "hidden",
};;

const playButtonStyle = {
  position: "absolute",
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  backgroundColor: "rgba(0,0,0,0.6)",
  color: "#fff",
  border: "none",
  fontSize: "20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

function MusicInfo() {
  const { id } = useParams()
  const location = useLocation();
  const { title, artist, album, cover } = location.state || {};
  const [panelType, setPanelType] = useState("default");

  const renderRightPanel = () => {
    switch (panelType) {
      case "next":
        return <p>🎵 다음노래: {title} - 다음 트랙 미리보기</p>;
      case "related":
        return <p>🎧 관련노래 목록<br />- 곡 A<br />- 곡 B<br />- 곡 C</p>;
      case "videos":
        return <p>📺 관련영상 목록<br />- 인터뷰 영상<br />- 무대 영상</p>;
      default:
        return <p>오른쪽 패널에 표시할 내용을 선택하세요.</p>;
    }
  };

  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", height: "100vh" }}>
      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "30px 0 30px 30px",
          backgroundColor: "#f0f4fb",
          overflowY: "auto",
        }}
      >
        {/* 검색창 */}
        <div style={{ marginBottom: "30px", paddingRight: "30px" }}>
          <input
            type="text"
            placeholder="Search"
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>

        {/* 앨범 커버 + 정보 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", paddingRight: "30px" }}>
          <Link to={`/lyrics/${id}`}  state={{ title, artist }}>
            <div
              style={{
                width: "250px",
                height: "250px",
                backgroundImage: `url(${cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "#ccc",
                borderRadius: "10px",
              }}
            />
          </Link>

          <div>
            <h2>{title || "노래제목"}</h2>
            <p>{artist || "가수"}</p>
            <p>{album || "앨범명"}</p>
          </div>
        </div>

        {/* Video Section */}
        <div style={{ marginTop: "50px", paddingRight: "30px" }}>
          <h3>🎬 뮤직비디오</h3>
          <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
              marginTop: "15px"
            }}>
            {["뮤비 1", "뮤비 2"].map((text, i) => (
              <div key={i} style={thumbnailStyle}>
                {text}
                <button style={{ ...playButtonStyle, bottom: "10px", right: "10px" }}>▶</button>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: "40px" }}>🎥 커버 영상</h3>
          <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
              marginTop: "15px"
            }}>
            {["커버 1", "커버 2"].map((text, i) => (
              <div key={i} style={thumbnailStyle}>
                {text}
                <button style={{ ...playButtonStyle, bottom: "10px", right: "10px" }}>▶</button>
              </div>
            ))}
          </div>
        </div>

        {/* Related Videos */}
        <div style={{ marginTop: "40px", paddingRight: "30px" }}>
          <h3>📺 관련 영상</h3>
          <ul style={{ paddingLeft: "20px" }}>
            <li>인터뷰: {artist || "가수"}의 비하인드 스토리</li>
            <li>{title || "노래"}의 라이브 무대 영상</li>
            <li>{artist || "가수"} - 다른 히트곡 모음</li>
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div
        style={{
          width: "350px",
          minWidth: "200px",
          backgroundColor: "#cbd4ec",
          padding: "20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "10px" }}>
          <button style={buttonStyle} onClick={() => setPanelType("next")}>다음노래</button>
          <button style={buttonStyle} onClick={() => setPanelType("related")}>관련노래</button>
         
          <Link
            to={`/detail/${id}`} 
            state={{ title, artist, album, cover }}
            style={{
              ...buttonStyle,
              textAlign: "center",
              textDecoration: "none",
              color: "#333",
              display: "inline-block",
            }}
          >
            상세정보
          </Link>
        </div>

        {/* Content */}
        <div style={{ marginTop: "20px", fontSize: "15px" }}>
          {renderRightPanel()}
        </div>
      </div>
    </div>
  );
}

export default MusicInfo;
