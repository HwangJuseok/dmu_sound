package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 신규 앨범 출시 정보를 나타내는 DTO 클래스.
 */
@Data
@NoArgsConstructor // 기본 생성자 제공
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class NewReleaseDto {

    private String albumName; // 앨범 이름
    private String artistName; // 아티스트 이름
    private String imageUrl; // 앨범 이미지 URL
}