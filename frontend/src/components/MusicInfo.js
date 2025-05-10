import React, { useState } from "react";
import "../styles/components/MusicInfo.css"
function MusicInfo({ info }) {
  const [show, setShow] = useState(false);

  return (
    <div className="music-info">
        <div className="info-panel">
          <p>{info}</p>
        </div>
    </div>
  );
}

export default MusicInfo;
