package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistDetailDto {
    private String id;
    private String name;
    private String imageUrl;
    private List<TrackDetailDto> topTracks;
}