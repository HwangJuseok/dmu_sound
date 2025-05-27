package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 신규 앨범 출시 정보를 나타내는 DTO 클래스.
 */
@Data
@NoArgsConstructor // 기본 생성자 제공
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class NewReleaseDto {

    @Schema(description = "앨범 이름", example = "BE")
    private String albumName; // 앨범 이름

    @Schema(description = "아티스트 이름", example = "BTS")
    private String artistName; // 아티스트 이름

    @Schema(description = "앨범 이미지 URL", example = "https://i.scdn.co/image/ab67616d0000b273ac3bbf9c278d4a7f6725e4b6")
    private String imageUrl; // 앨범 이미지 URL

    @Schema(description = "트랙 id")
    private String trackId;
}
