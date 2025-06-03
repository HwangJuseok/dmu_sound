package dmusound.controller;

import dmusound.dto.playlist.PlaylistDto;
import dmusound.dto.playlist.PlaylistTrackDto;
import dmusound.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    // 플레이리스트 생성
    @PostMapping
    public ResponseEntity<String> createPlaylist(@RequestBody PlaylistDto dto) {
        try {
            playlistService.createPlaylist(dto);
            return ResponseEntity.ok("플레이리스트 생성 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("플레이리스트 생성 실패: " + e.getMessage());
        }
    }

    // 플레이리스트에 트랙 추가
    @PostMapping("/{playlistId}/tracks")
    public ResponseEntity<String> addTrackToPlaylist(@PathVariable String playlistId,
                                                     @RequestBody PlaylistTrackDto dto) {
        try {
            playlistService.addTrackToPlaylist(playlistId, dto);
            return ResponseEntity.ok("곡 추가 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("곡 추가 실패: " + e.getMessage());
        }
    }

    // 플레이리스트에서 트랙 삭제
    @DeleteMapping("/{playlistId}/tracks")
    public ResponseEntity<String> removeTrackFromPlaylist(@PathVariable String playlistId,
                                                          @RequestParam String trackId,
                                                          @RequestParam String userCode) {
        try {
            playlistService.removeTrackFromPlaylist(playlistId, trackId, userCode);
            return ResponseEntity.ok("곡 삭제 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("곡 삭제 실패: " + e.getMessage());
        }
    }


    // 유저 플레이리스트 조회
    @GetMapping("/user/{userCode}")
    public ResponseEntity<List<PlaylistDto>> getUserPlaylists(@PathVariable String userCode) {
        List<PlaylistDto> playlists = playlistService.getPlaylistsByUser(userCode);
        return ResponseEntity.ok(playlists);
    }

    // 플레이리스트 트랙 조회
    @GetMapping("/{playlistId}/tracks")
    public ResponseEntity<List<PlaylistTrackDto>> getPlaylistTracks(@PathVariable String playlistId) {
        List<PlaylistTrackDto> tracks = playlistService.getTracksByPlaylist(playlistId);
        return ResponseEntity.ok(tracks);
    }
}
