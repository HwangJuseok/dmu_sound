import React, { useState } from "react";
import axios from "axios";
// 실행시 프론트엔드는 npm start node modules는 삭제해둠 실행하기 전 npm install
// 백엔드는 mvn spring-boot:run
const App = () => {
    const [videoTitle, setVideoTitle] = useState("");
    const [channelName, setChannelName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // 검색어 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태

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

    const handleSearch = async (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지
        try {
            const encodedQuery = encodeURIComponent(searchQuery);
            const response = await fetch(`http://localhost:8080/api/youtube/music_search?keyword=${encodedQuery}`);
            if (!response.ok) throw new Error("검색 실패");
            const data = await response.json();
            console.log(data);
            setSearchResults(data.items); // 검색 결과를 상태에 저장
        } catch (error) {
            console.error("API 요청 중 오류 발생:", error);
            setErrorMessage("검색 중 오류가 발생했습니다.");
        }
    };
    

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>YouTube 검색</h1>

            {/* 검색 입력창 */}
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="이곳에 텍스트 입력"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                />
                <button type="submit">검색</button>
            </form>

            {/* 검색 결과 표시 */}
            <div>
                <h2>검색 결과</h2>
                <div>
                    {searchResults.length > 0 ? (
                        searchResults.map((item, index) => (
                            <p key={index}>
                                <a href={`https://www.youtube.com/watch?v=${item.id.videoId}`} target="_blank" rel="noopener noreferrer">
                                    {item.snippet.title}
                                </a>
                            </p>
                        ))
                    ) : (
                        <p>{errorMessage}</p>
                    )}
                </div>
            </div>

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
                    marginTop: "20px",
                }}
            >
                유튜브 음악 정보 가져오기
            </button>

            <div style={{ marginTop: "20px", fontSize: "16px", color: "#333" }}>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
