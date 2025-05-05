package dmusound.dto.youtube;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 유튜브 비디오 정보를 나타내는 DTO 클래스.
 */
@Data
@NoArgsConstructor // 기본 생성자 제공
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class VideoDto {

    @Schema(description = "비디오 ID", example = "dQw4w9WgXcQ")
    private String videoId; // 비디오 ID

    @Schema(description = "비디오 제목", example = "Rick Astley - Never Gonna Give You Up (Video)")
    private String title; // 비디오 제목

    @Schema(description = "썸네일 이미지 URL", example = "https://i.ytimg.com/vi/dQw4w9WgXcQ/0.jpg")
    private String thumbnailUrl; // 썸네일 이미지 URL
}
