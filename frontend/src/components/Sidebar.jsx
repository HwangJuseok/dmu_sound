import React from "react";
import { Link } from "react-router-dom";
import "../styles/components/Sidebar.css";

function Sidebar({ onToggle }) {
  return (
    <aside className="sidebar">
      <button className="close-button" onClick={onToggle}>☰</button>
      <h2>dmu_sound</h2>
      <nav>
        <p><Link to="/">🏠 홈</Link></p>
        <p><Link to="/chart">📊 차트</Link></p>
        <p><Link to="/playlist">🎵 플레이리스트</Link></p>
      </nav>
      <hr />
      <div>
        <p>내 플레이리스트1</p>
        <p>내 플레이리스트2</p>
        <p>내 플레이리스트3</p>
      </div>
    </aside>
  );
}

export default Sidebar;
