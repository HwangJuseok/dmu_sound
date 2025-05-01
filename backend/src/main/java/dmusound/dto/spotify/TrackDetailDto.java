package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrackDetailDto {
    private String id;
    private String trackName;
    private String artistId;
    private String artistName;
    private String albumId;
    private String albumName;
    private String imageUrl;
    private String previewUrl; // Spotify embed URL 또는 오디오 미리듣기 링크
}