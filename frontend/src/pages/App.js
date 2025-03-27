import React, { useState } from "react";
import axios from "axios";

const App = () => {
    const [accessToken, setAccessToken] = useState(""); // Spotify Access Token 상태
    const [videoTitle, setVideoTitle] = useState(""); // 영상 제목 상태
    const [channelName, setChannelName] = useState(""); // 채널 이름 상태
    const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

    // Spotify Access Token 가져오기
    const fetchSpotifyToken = async () => {
        try {
            const response = await axios.get("http://localhost:8080/spotify/token");
            setAccessToken(response.data.access_token);
        } catch (error) {
            setErrorMessage("Spotify API 연동 실패: " + error.message);
        }
    };

    // 유튜브 API 검색
    const handleButtonClick = async () => {
        try {
            const randomKeywords = ["NMIXX HIGH HORSE", "NMIXX Live", "NMIXX Performance"];
            const randomKeyword = randomKeywords[Math.floor(Math.random() * randomKeywords.length)];

            const response = await axios.get(
                `http://localhost:8080/api/youtube/search?keyword=${encodeURIComponent(randomKeyword)}`
            );
            const firstVideo = response.data.items[0];

            if (firstVideo) {
                setVideoTitle(firstVideo.snippet.title);
                setChannelName(firstVideo.snippet.channelTitle);
                setErrorMessage("");
            } else {
                setErrorMessage("검색 결과가 없습니다.");
            }
        } catch (error) {
            setErrorMessage("API 연동 실패: " + error.message);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <button
                onClick={fetchSpotifyToken}
                style={{
                    padding: "10px 20px",
                    fontSize: "16px",
                    backgroundColor: "#1DB954",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "10px",
                }}
            >
                Spotify Access Token 가져오기
            </button>

            <button
                onClick={handleButtonClick}
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

            <div style={{ marginTop: "20px", fontSize: "16px", color: "#333" }}>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {accessToken && (
                    <div>
                        <p>
                            <strong>Spotify Access Token:</strong> {accessToken}
                        </p>
                    </div>
                )}
                {!errorMessage && videoTitle && channelName && (
                    <div>
                        <p>
                            <strong>영상 제목:</strong> {videoTitle}
                        </p>
                        <p>
                            <strong>채널 이름:</strong> {channelName}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
