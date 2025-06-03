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

    @JsonProperty("image_url")
    private String imageUrl;

}
