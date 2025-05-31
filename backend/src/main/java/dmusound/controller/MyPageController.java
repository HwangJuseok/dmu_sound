package dmusound.controller;

import dmusound.dto.spotify.TrackDetailDto;
import dmusound.service.SpotifyService;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
@Tag(name = "MyPageController", description = "마이페이지에서 트랙 검색 후 트랙 ID를 반환하는 API입니다.")
public class MyPageController {

    private final SpotifyService spotifyService;

    @Operation(
            summary = "트랙 ID 검색",
            description = "트랙 제목과 아티스트 이름으로 Spotify에서 검색하여 첫 번째 검색 결과를 반환합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "트랙 검색 성공",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = TrackDetailDto.class))),
            @ApiResponse(responseCode = "404", description = "검색 결과 없음",
                    content = @Content(mediaType = "application/json"))
    })
    @GetMapping("/track/play")
    public Mono<ResponseEntity<TrackDetailDto>> getTrackByTitleAndArtist(
            @RequestParam String title,
            @RequestParam String artist) {

        return spotifyService.fetchTrack(title, artist)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
