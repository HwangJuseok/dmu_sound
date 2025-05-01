package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

/**
 * 앨범 세부 정보를 나타내는 DTO 클래스.
 */
@Data
@NoArgsConstructor // 기본 생성자 제공
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class AlbumDetailDto {

    private String id; // 앨범 ID
    private String name; // 앨범 이름
    private String artistId; // 아티스트 ID
    private String artistName; // 아티스트 이름
    private String imageUrl; // 앨범 이미지 URL
    private List<TrackDetailDto> tracks; // 앨범의 트랙 목록

    /**
     * 트랙 개수를 반환.
     * @return 트랙 개수 (tracks가 null이면 0)
     */
    public int getTrackCount() {
        return tracks == null ? 0 : tracks.size();
    }

    /**
     * 트랙 목록을 반환 (null일 경우 빈 리스트 반환).
     * @return 트랙 목록
     */
    public List<TrackDetailDto> getSafeTracks() {
        return tracks == null ? Collections.emptyList() : tracks;
    }
}