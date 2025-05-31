package dmusound.dto.youtube;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 유튜브 트렌딩 비디오 정보를 나타내는 DTO 클래스.
 */
@Data
@NoArgsConstructor // 기본 생성자 제공
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class TrendingVideoDto {

    @Schema(description = "비디오 제목", example = "How to Make a Song in 5 Minutes")
    private String title; // 비디오 제목

    @Schema(description = "채널 이름", example = "MusicStudio")
    private String channel; // 채널 이름

    @Schema(description = "썸네일 이미지 URL", example = "https://i.ytimg.com/vi/abc123/0.jpg")
    private String thumbnailUrl; // 썸네일 이미지 URL

    @Schema
    private String videoUrl;
}
