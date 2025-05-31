package dmusound.dto.playlist;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlaylistDto {
    @JsonProperty("playlist_id")
    private String playlistId;

    @JsonProperty("user_code")
    private String userCode;

    @JsonProperty("playlist_name")
    private String playlistName;

    @JsonProperty("added_at")
    private String addedAt;
}
