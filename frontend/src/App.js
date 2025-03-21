import React, { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");

  const handleButtonClick = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tracks?query=test", {
        withCredentials: true,
      });
      setMessage("API 연동 성공! 응답 받음: " + JSON.stringify(response.data));
    } catch (error) {
      console.error("API 호출 에러:", error);
      setMessage("API 연동 실패!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button 
        onClick={handleButtonClick} 
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
        API 확인
      </button>
      <div style={{ marginTop: "20px", fontSize: "14px", color: "blue" }}>
        {message}
      </div>
    </div>
  );
}

export default App;
