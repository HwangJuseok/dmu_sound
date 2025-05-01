package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 검색 결과 정보를 나타내는 DTO 클래스.
 */
@Data
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class SearchResultDto {

    private String id; // 검색 결과 ID
    private String type; // 결과 유형 ("track" 또는 "artist")
    private String name; // 결과 이름
    private String subInfo; // 부가 정보 (예: 아티스트 이름 또는 앨범 이름)
    private String imageUrl; // 이미지 URL

    private boolean isTrack; // 트랙 여부를 나타내는 플래그
    private boolean isArtist; // 아티스트 여부를 나타내는 플래그

    /**
     * 생성자: 데이터 초기화 및 타입에 따른 플래그 설정.
     * @param id 검색 결과 ID
     * @param type 결과 유형 ("track" 또는 "artist")
     * @param name 결과 이름
     * @param subInfo 부가 정보 (예: 아티스트 이름 또는 앨범 이름)
     * @param imageUrl 이미지 URL
     */
    public SearchResultDto(String id, String type, String name, String subInfo, String imageUrl) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.subInfo = subInfo;
        this.imageUrl = imageUrl;
        this.isTrack = "track".equalsIgnoreCase(type);
        this.isArtist = "artist".equalsIgnoreCase(type);
    }
}