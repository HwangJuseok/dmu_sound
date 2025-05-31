package dmusound.controller;

import dmusound.dto.spotify.TrackDetailDto;
import dmusound.service.AcrService;
import dmusound.service.SpotifyService;
import dmusound.service.AcrService.TitleArtistPair;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/mypage")
@Tag(name = "MyPageController", description = "마이페이지에서 트랙 추천 API")
public class MyPageController {

    private final AcrService acrService;
    private final SpotifyService spotifyService;

    @Operation(summary = "사용자의 ACR 기반 추천 트랙 리스트 반환")
    @GetMapping("/recommend")
    public Mono<ResponseEntity<List<TrackDetailDto>>> getTracks(@RequestParam String userCode) {
        List<TitleArtistPair> acrPairs = acrService.getAcrTitlesAndArtistsByUserCode(userCode);

        List<Mono<TrackDetailDto>> trackMonos = acrPairs.stream()
                .map(pair -> spotifyService.fetchTrack(pair.getTitle(), pair.getArtist()))
                .toList();

        return Flux.merge(trackMonos)
                .collectList()
                .map(ResponseEntity::ok);
    }
}
