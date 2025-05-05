package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 트랙 세부 정보를 나타내는 DTO 클래스.
 */
@Data
@NoArgsConstructor // 기본 생성자 제공
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class TrackDetailDto {

    @Schema(description = "트랙 ID", example = "5WJlFh2bXh9vGpFD8PsgtD")
    private String id; // 트랙 ID

    @Schema(description = "트랙 이름", example = "Dynamite")
    private String trackName; // 트랙 이름

    @Schema(description = "아티스트 ID", example = "3Nrfpe0tUJi4K4DXYWgMUX")
    private String artistId; // 아티스트 ID

    @Schema(description = "아티스트 이름", example = "BTS")
    private String artistName; // 아티스트 이름

    @Schema(description = "앨범 ID", example = "5fvWq0FdtNmtQ0pSUpF2RH")
    private String albumId; // 앨범 ID

    @Schema(description = "앨범 이름", example = "BE")
    private String albumName; // 앨범 이름

    @Schema(description = "트랙 이미지 URL", example = "https://i.scdn.co/image/ab67616d0000b273ac3bbf9c278d4a7f6725e4b6")
    private String imageUrl; // 트랙 이미지 URL

    @Schema(description = "트랙 오디오 미리듣기 또는 Spotify embed URL", example = "https://p.scdn.co/mp3-preview/5821d49f607b7b1f462b84be8c08fe6062c5d62b")
    private String previewUrl; // 트랙 오디오 미리듣기 또는 Spotify embed URL
}
