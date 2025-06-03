package dmusound.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import dmusound.client.SupabaseClient;
import dmusound.dto.playlist.PlaylistDto;
import dmusound.dto.playlist.PlaylistTrackDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final SupabaseClient supabaseClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 플레이리스트 생성
    public void createPlaylist(PlaylistDto dto) {
        if (dto.getPlaylistName() == null || dto.getPlaylistName().isEmpty()) {
            throw new IllegalArgumentException("플레이리스트 이름은 필수입니다.");
        }

        boolean success = supabaseClient.insertPlaylist(dto);
        if (!success) {
            throw new RuntimeException("플레이리스트 생성 실패");
        }
    }

    // 플레이리스트에 곡 추가
    public void addTrackToPlaylist(String playlistId, PlaylistTrackDto dto) {
        if (dto.getTrackId() == null || dto.getTrackId().isEmpty()) {
            throw new IllegalArgumentException("곡 ID(spotifyId)는 필수입니다.");
        }

        // 중복 체크
        boolean exists = supabaseClient.checkTrackExists(dto.getUserCode(), playlistId, dto.getTrackId());
        if (exists) {
            throw new RuntimeException("이미 추가된 곡입니다.");
        }

        dto.setPlaylistId(playlistId);
        boolean success = supabaseClient.insertPlaylistTrack(dto);
        if (!success) {
            throw new RuntimeException("곡 추가 실패");
        }
    }

    // 플레이리스트에서 곡 삭제
    public void removeTrackFromPlaylist(String playlistId, String trackId, String userCode) {
        if (trackId == null || trackId.isEmpty()) {
            throw new IllegalArgumentException("곡 ID(trackId)는 필수입니다.");
        }

        boolean success = supabaseClient.deleteTrackFromPlaylist(userCode, playlistId, trackId);
        if (!success) {
            throw new RuntimeException("곡 삭제 실패");
        }
    }

    // 플레이리스트 삭제 - 새로 추가
    public void deletePlaylist(String playlistId, String userCode) {
        if (playlistId == null || playlistId.isEmpty()) {
            throw new IllegalArgumentException("플레이리스트 ID는 필수입니다.");
        }
        if (userCode == null || userCode.isEmpty()) {
            throw new IllegalArgumentException("사용자 코드는 필수입니다.");
        }

        // 먼저 플레이리스트의 모든 트랙 삭제
        boolean tracksDeleted = supabaseClient.deleteAllTracksFromPlaylist(userCode, playlistId);
        if (!tracksDeleted) {
            throw new RuntimeException("플레이리스트 트랙 삭제 실패");
        }

        // 플레이리스트 삭제
        boolean playlistDeleted = supabaseClient.deletePlaylist(userCode, playlistId);
        if (!playlistDeleted) {
            throw new RuntimeException("플레이리스트 삭제 실패");
        }
    }

    // 유저의 플레이리스트 목록 조회
    public List<PlaylistDto> getPlaylistsByUser(String userCode) {
        try {
            String json = supabaseClient.getPlaylistsByUser(userCode).getBody();
            return objectMapper.readValue(json, new TypeReference<List<PlaylistDto>>() {});
        } catch (Exception e) {
            throw new RuntimeException("플레이리스트 조회 실패", e);
        }
    }

    // 특정 플레이리스트의 트랙 목록 조회
    public List<PlaylistTrackDto> getTracksByPlaylist(String playlistId) {
        try {
            String json = supabaseClient.getTracksByPlaylist(playlistId).getBody();
            return objectMapper.readValue(json, new TypeReference<List<PlaylistTrackDto>>() {});
        } catch (Exception e) {
            throw new RuntimeException("플레이리스트 트랙 조회 실패", e);
        }
    }
}
