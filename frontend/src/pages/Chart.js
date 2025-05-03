import React from "react";
import { dummyChart } from "../utils/dummyData";
import "../styles/Chart.css";

function Chart() {
  return (
    <div className="chart-page">
      <h1>📊 실시간 차트</h1>
      <ul className="chart-list">
        {dummyChart.map((track, index) => (
          <li key={track.id} className="chart-item">
            <span className="rank">{index + 1}</span>
            <img src={track.image} alt={track.title} />
            <div className="info">
              <span className="title">{track.title}</span>
              <span className="artist">{track.artist}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Chart;
