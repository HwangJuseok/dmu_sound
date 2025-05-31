import React from "react";
import { useParams } from "react-router-dom";
import { samplePlaylists } from "../utils/dummyData";
import "../styles/PlaylistDetailPage.css";

function PlaylistDetailPage() {
  const { id } = useParams();
  const playlist = samplePlaylists.find((pl) => pl.id === parseInt(id));

  if (!playlist) {
    return <div>존재하지 않는 플레이리스트입니다.</div>;
  }

  return (
    <div className="playlist-detail-page">
      <h1>{playlist.name}</h1>
      <p>{playlist.description}</p>

      {playlist.tracks.length > 0 ? (
        playlist.tracks.map((track) => (
          <div key={track.id} className="track-card">
            <img src={track.imageUrl} alt={track.trackName} width={80} />
            <div>
              <h3>{track.trackName}</h3>
              <p>{track.artistName}</p>
              <p>{track.albumName}</p>
              {track.previewUrl && (
                <audio controls>
                  <source src={track.previewUrl} type="audio/mpeg" />
                </audio>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>플레이리스트에 곡이 없습니다.</p>
      )}
    </div>
  );
}

export default PlaylistDetailPage;
