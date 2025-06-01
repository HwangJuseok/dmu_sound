package dmusound.client;

import dmusound.config.SupabaseConfig;
import dmusound.dto.playlist.PlaylistDto;
import dmusound.dto.playlist.PlaylistTrackDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SupabaseClient {

    @Autowired
    private SupabaseConfig config;

    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> getData(String tableName) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", config.apiKey);
        headers.set("Authorization", "Bearer " + config.apiKey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(
                config.baseUrl + "/" + tableName,
                HttpMethod.GET,
                entity,
                String.class
        );
    }

    public ResponseEntity<String> insertData(String tableName, String jsonData) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", config.apiKey);
        headers.set("Authorization", "Bearer " + config.apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Prefer", "resolution=merge-duplicates"); // 중복 시 업데이트

        HttpEntity<String> entity = new HttpEntity<>(jsonData, headers);

        return restTemplate.exchange(
                config.baseUrl + "/" + tableName,
                HttpMethod.POST,
                entity,
                String.class
        );
    }

    // 플레이리스트 생성
    public boolean insertPlaylist(PlaylistDto dto) {
        String json = String.format("""
            {
                "user_code": "%s",
                "playlist_name": "%s"
            }
            """, dto.getUserCode(), dto.getPlaylistName());

        ResponseEntity<String> response = insertData("playlist", json);
        return response.getStatusCode() == HttpStatus.CREATED;
    }

    // 플레이리스트 트랙 추가
    public boolean insertPlaylistTrack(PlaylistTrackDto dto) {
        String json = String.format("""
        {
            "user_code": "%s",
            "playlist_id": "%s",
            "spotify_id": "%s",
            "added_at": "%s",
            "track_name": "%s",
            "artist_name": "%s",
            "image_url": "%s"
        }
        """,
                dto.getUserCode(),
                dto.getPlaylistId(),
                dto.getSpotifyId(),
                dto.getAddedAt() != null ? dto.getAddedAt() : java.time.OffsetDateTime.now().toString(),
                dto.getTrackName() != null ? dto.getTrackName() : "",
                dto.getArtistName() != null ? dto.getArtistName() : "",
                dto.getImageUrl() != null ? dto.getImageUrl() : ""
        );

        ResponseEntity<String> response = insertData("playlist_track", json);
        return response.getStatusCode() == HttpStatus.CREATED;
    }

    // 특정 곡 삭제
    public boolean deleteTrackFromPlaylist(String userCode, String playlistId, String spotifyId) {
        String url = String.format(
                "%s/playlist_track?user_code=eq.%s&playlist_id=eq.%s&spotify_id=eq.%s",
                config.baseUrl, userCode, playlistId, spotifyId
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", config.apiKey);
        headers.set("Authorization", "Bearer " + config.apiKey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, entity, String.class);
        return response.getStatusCode().is2xxSuccessful();
    }


    // 중복 체크: 유저, 플레이리스트, 트랙이 이미 존재하는지 확인
    public boolean checkTrackExists(String userCode, String playlistId, String spotifyId) {
        String url = String.format("%s/playlist_track?user_code=eq.%s&playlist_id=eq.%s&spotify_id=eq.%s",
                config.baseUrl, userCode, playlistId, spotifyId);

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", config.apiKey);
        headers.set("Authorization", "Bearer " + config.apiKey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

        // 빈 배열이면 중복 없음, 내용 있으면 중복 존재
        return response.getBody() != null && !response.getBody().equals("[]");
    }

    // 사용자 플레이리스트 조회
    public ResponseEntity<String> getPlaylistsByUser(String userCode) {
        String url = String.format("%s/playlist?user_code=eq.%s", config.baseUrl, userCode);

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", config.apiKey);
        headers.set("Authorization", "Bearer " + config.apiKey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }

    // 특정 플레이리스트 트랙 조회
    public ResponseEntity<String> getTracksByPlaylist(String playlistId) {
        String url = String.format("%s/playlist_track?playlist_id=eq.%s", config.baseUrl, playlistId);

        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", config.apiKey);
        headers.set("Authorization", "Bearer " + config.apiKey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
    }
}
