package dmusound.dto.spotify;

import lombok.AllArgsConstructor;
import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 검색 결과 정보를 나타내는 DTO 클래스.
 */
@Data
@AllArgsConstructor // 모든 필드를 초기화하는 생성자 제공
public class SearchResultDto {

    @Schema(description = "검색 결과 ID", example = "5WJlFh2bXh9vGpFD8PsgtD")
    private String id; // 검색 결과 ID

    @Schema(description = "결과 유형 (track 또는 artist)", example = "track")
    private String type; // 결과 유형 ("track" 또는 "artist")

    @Schema(description = "결과 이름", example = "Dynamite")
    private String name; // 결과 이름

    @Schema(description = "부가 정보 (예: 아티스트 이름 또는 앨범 이름)", example = "BTS")
    private String subInfo; // 부가 정보 (예: 아티스트 이름 또는 앨범 이름)

    @Schema(description = "이미지 URL", example = "https://i.scdn.co/image/ab67616d0000b273ac3bbf9c278d4a7f6725e4b6")
    private String imageUrl; // 이미지 URL

    @Schema(description = "트랙 여부를 나타내는 플래그", example = "true")
    private boolean isTrack; // 트랙 여부를 나타내는 플래그

    @Schema(description = "아티스트 여부를 나타내는 플래그", example = "false")
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
