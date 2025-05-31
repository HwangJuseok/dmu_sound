import React from "react";
import '../styles/components/SongCard.css';
import { Link } from "react-router-dom";
// function SongCard({ song }) {
//   return (
//     <div className="song-card">
//       <Link to={`/music/${song.id}`}>
//         <h2>{song.title}</h2>
//         <p>{song.artist}</p>
//       </Link>
//     </div>
//   );
// }

const SongCard = ({ song }) => {
    // song 데이터에서 필요한 정보(id, 제목, 아티스트, 이미지)를 추출하는 함수
    // Spotify 데이터와 YouTube 데이터 구조가 다르기 때문에 구분해서 처리
    const getSongData = () => {
    if (song.albumName) {
        // ✅ trackId가 있는 경우 우선 사용
        return {
            id: song.trackId || Math.random().toString(36).substr(2, 9),
            title: song.albumName,
            artist: song.artistName,
            imageUrl: song.imageUrl
        };
    } else if (song.title) {
        // YouTube 형식 데이터
        return {
            id: song.videoId || Math.random().toString(36).substr(2, 9),
            title: song.title,
            artist: song.channel,
            imageUrl: song.thumbnailUrl
        };
    } else {
        return song;
    }
};

    // song 객체에서 필요한 정보만 추출해서 사용
    const songData = getSongData();

    return (
        // 노래 상세 페이지로 이동하는 링크, id를 URL 파라미터로 전달
        <Link to={`/music/${songData.id}`} className="song-card-link">
            <div className="song-card">
                <div className="cover">
                    {/* 노래 앨범 커버 또는 썸네일 이미지 */}
                    <img
                        src={songData.imageUrl}
                        alt={songData.title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '4px'
                        }}
                        // 이미지 로딩 실패 시 이미지 숨기고 배경색 변경 (빈 공간 표시용)
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.style.backgroundColor = '#ddd';
                        }}
                    />
                </div>
                <div className="song-info">
                    {/* 노래 제목 */}
                    <h3>{songData.title}</h3>
                    {/* 아티스트 또는 채널명 */}
                    <p>{songData.artist}</p>
                </div>
            </div>
        </Link>
    );
};

export default SongCard;