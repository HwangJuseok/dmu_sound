package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Collections;
import java.util.List;

/**
 * 아티스트 세부 정보를 나타내는 DTO 클래스.
 */
@Data
@NoArgsConstructor // 기본 생성자 제공
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class ArtistDetailDto {

    private String id; // 아티스트 ID
    private String name; // 아티스트 이름
    private String imageUrl; // 아티스트 이미지 URL
    private List<TrackDetailDto> topTracks; // 아티스트의 인기 트랙 목록

    /**
     * 인기 트랙 개수를 반환.
     * @return 트랙 개수 (topTracks가 null이면 0)
     */
    public int getTopTrackCount() {
        return topTracks == null ? 0 : topTracks.size();
    }

    /**
     * 인기 트랙 목록을 반환 (null일 경우 빈 리스트 반환).
     * @return 인기 트랙 목록
     */
    public List<TrackDetailDto> getSafeTopTracks() {
        return topTracks == null ? Collections.emptyList() : topTracks;
    }
}