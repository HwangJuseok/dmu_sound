package dmusound.dto.youtube;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 유튜브 트렌딩 비디오 정보를 나타내는 DTO 클래스.
 */
@Data
@NoArgsConstructor // 기본 생성자 제공
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class TrendingVideoDto {

    private String title; // 비디오 제목
    private String channel; // 채널 이름
    private String thumbnailUrl; // 썸네일 이미지 URL
}