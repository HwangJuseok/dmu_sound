import React from "react";
import SongGrid from "./SongGrid";
import "../styles/components/Section.css";

// function Section({ title }) {
//   return (
//     <section className="section">
//       <h3>{title}</h3>
//       <SongGrid />
//     </section>
//   );
// }

const Section = ({ title, songs, icon: Icon }) => {
    // 섹션 타입에 따른 CSS 클래스 결정
    const getSectionClass = () => {
        if (title.includes('Spotify')) return 'section spotify-section';
        if (title.includes('YouTube')) return 'section youtube-section';
        if (title.includes('검색')) return 'section search-section';
        return 'section';
    };

    return (
        <section className={getSectionClass()}>
            <div className="section-header">
                {Icon && <Icon className="section-icon" />}
                <h3 className="section-title">{title}</h3>
            </div>

            {songs && songs.length > 0 ? (
                <SongGrid songs={songs} />
            ) : (
                <div className="section-loading">
                    <p>데이터를 불러오는 중입니다...</p>
                </div>
            )}
        </section>
    );
};

export default Section;