package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlbumDetailDto {
    private String id;
    private String name;
    private String artistId;
    private String artistName;
    private String imageUrl;
    private List<TrackDetailDto> tracks;
}
