package dmusound.dto.playlist;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistTrackDto {

    @JsonProperty("user_code")
    private String userCode;

    @JsonProperty("playlist_id")
    private String playlistId;

    @JsonProperty("track_id")
    private String trackId;

    @JsonProperty("added_at")
    private String addedAt;

    @JsonProperty("track_name")
    private String trackName;

    @JsonProperty("artist_name")
    private String artistName;

    @JsonProperty("album_name")  // 추가 필드
    private String albumName;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("spotify_id")  // 추가 필드 - Spotify ID (track_id와 동일하지만 명확성을 위해)
    private String spotifyId; // 우선 넣어 보고 지움

}
