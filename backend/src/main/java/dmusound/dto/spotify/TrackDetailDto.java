package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 트랙 세부 정보를 나타내는 DTO 클래스.
 */
@Data
@NoArgsConstructor // 기본 생성자 제공
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class TrackDetailDto {

    private String id; // 트랙 ID
    private String trackName; // 트랙 이름
    private String artistId; // 아티스트 ID
    private String artistName; // 아티스트 이름
    private String albumId; // 앨범 ID
    private String albumName; // 앨범 이름
    private String imageUrl; // 트랙 이미지 URL
    private String previewUrl; // 트랙 오디오 미리듣기 또는 Spotify embed URL
}