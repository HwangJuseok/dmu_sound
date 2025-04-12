import React, { useState } from "react";
import axios from "axios";
import YouTube from "react-youtube";
// 실행시 프론트엔드 node modules 없으면 실행하기 전 npm install
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
                `http://localhost:8080/api/v1/youtube/search?keyword=${encodeURIComponent(randomKeyword)}`
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
            const response = await fetch(`http://localhost:8080/api/v1/youtube/music_search?keyword=${encodedQuery}`);
            if (!response.ok) throw new Error("검색 실패");
            const data = await response.json();

            // 제목에 검색어가 포함된 것만 필터링 (대소문자 무시)
            const filteredItems = data.items.filter(item => {
                const normalizedTitle = item.snippet.title.toLowerCase().replace(/\s+/g, "");
                const normalizedQuery = searchQuery.toLowerCase().replace(/\s+/g, "");
                return normalizedTitle.includes(normalizedQuery) && normalizedTitle.includes("cover");
            });
            

            setSearchResults(filteredItems);
            setErrorMessage(filteredItems.length === 0 ? "검색어가 포함된 영상이 없습니다." : "");
        } catch (error) {
            console.error("API 요청 중 오류 발생:", error);
            setErrorMessage("검색 중 오류가 발생했습니다.");
        }
    };
    
    

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>YouTube 검색</h1>

            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="검색어 입력"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                />
                <button type="submit">검색</button>
            </form>

            <div style={{ marginTop: "30px" }}>
                <h2>검색 결과</h2>
                {searchResults.length > 0 ? (
                    searchResults.map((item, index) => (
                        <div key={index} style={{ marginBottom: "40px" }}>
                            <YouTube videoId={item.id.videoId} opts={{ height: "315", width: "560" }} />
                            <p>
                                <a
                                    href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.snippet.title}
                                </a>
                            </p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                )}
            </div>
        </div>
    );
};

export default App;
