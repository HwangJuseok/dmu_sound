import React, { useState } from "react";
import axios from "axios";

function YouTubeFetchButton() {
  const [videoTitle, setVideoTitle] = useState("");
  const [channelName, setChannelName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFetch = async () => {
    try {
      const keywords = ["NMIXX HIGH HORSE", "NMIXX Live", "NMIXX Performance"];
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];

      const response = await axios.get(
        `http://localhost:8080/api/youtube/search?keyword=${encodeURIComponent(keyword)}`
      );
      const firstVideo = response.data.items[0];

      if (firstVideo) {
        setVideoTitle(firstVideo.snippet.title);
        setChannelName(firstVideo.snippet.channelTitle);
        setErrorMessage("");
      } else {
        setErrorMessage("검색 결과가 없습니다.");
      }
    } catch (err) {
      setErrorMessage("API 연동 실패: " + err.message);
    }
  };

  return (
    <div style={{ marginTop: "40px", textAlign: "center" }}>
      <button
        onClick={handleFetch}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        유튜브 음악 정보 가져오기
      </button>

      <div style={{ marginTop: "20px", fontSize: "16px" }}>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        {!errorMessage && videoTitle && channelName && (
          <div>
            <p><strong>영상 제목:</strong> {videoTitle}</p>
            <p><strong>채널 이름:</strong> {channelName}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default YouTubeFetchButton;