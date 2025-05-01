package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SearchResultDto {
    private String id;
    private String type; // "track" or "artist"
    private String name;
    private String subInfo;
    private String imageUrl;
}
