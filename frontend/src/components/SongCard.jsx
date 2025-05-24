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
    // 데이터 구조 통일화 (백엔드 DTO -> 프론트엔드 song 객체)
    const getSongData = () => {
        if (song.albumName) {
            // Spotify 데이터
            return {
                id: song.id || Math.random().toString(36).substr(2, 9),
                title: song.albumName,
                artist: song.artistName,
                imageUrl: song.imageUrl
            };
        } else if (song.title) {
            // YouTube 데이터
            return {
                id: song.videoId || Math.random().toString(36).substr(2, 9),
                title: song.title,
                artist: song.channel,
                imageUrl: song.thumbnailUrl
            };
        } else {
            // 기본 구조
            return song;
        }
    };

    const songData = getSongData();

    return (
        <div className="song-card">
            <div className="cover">
                <img
                    src={songData.imageUrl}
                    alt={songData.title}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px'
                    }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.style.backgroundColor = '#ddd';
                    }}
                />
            </div>
            <div className="song-info">
                <h3>{songData.title}</h3>
                <p>{songData.artist}</p>
            </div>
        </div>
    );
};

export default SongCard;