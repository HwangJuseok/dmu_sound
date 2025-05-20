import dmusound.dto.youtube.VideoDto;
import dmusound.service.SpotifyService;
import dmusound.service.YoutubeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/track")
@Tag(name = "MusicRestController", description = "트랙 상세 정보를 JSON으로 반환하는 REST 컨트롤러입니다.")
public class MusicRestController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @Operation(
            summary = "트랙 상세 정보 조회 (JSON)",
            description = "Spotify 트랙 ID로 트랙 정보와 관련 YouTube MV/커버 영상을 조회하여 JSON으로 반환합니다."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "성공적으로 트랙 정보를 반환함"),
            @ApiResponse(responseCode = "500", description = "서버 오류: API 요청 실패")
    })
    @GetMapping("/{id}")
    public Mono<ResponseEntity<?>> getTrackDetail(@PathVariable String id) {
        System.out.println("🎯 [REST 트랙 상세] 트랙 ID: " + id);

        return spotifyService.getTrackDetail(id)
                .flatMap(track -> {
                    String trackName = Optional.ofNullable(track.getTrackName()).orElse("Unknown Track");
                    String artistName = Optional.ofNullable(track.getArtistName()).orElse("Unknown Artist");

                    Mono<List<VideoDto>> mvSearch = youtubeService.searchVideos(trackName + " " + artistName + " official");
                    Mono<List<VideoDto>> coverSearch = youtubeService.searchVideos(trackName + " " + artistName + " cover");

                    return Mono.zip(mvSearch, coverSearch).map(tuple -> {
                        List<VideoDto> mvResults = tuple.getT1();
                        List<VideoDto> coverResults = tuple.getT2();

                        String musicVideo = mvResults.stream()
                                .filter(video -> {
                                    String title = video.getTitle().toLowerCase();
                                    return (title.contains("mv") || title.contains("official"))
                                            && title.contains(trackName.toLowerCase())
                                            && title.contains(artistName.split(" ")[0].toLowerCase());
                                })
                                .findFirst()
                                .or(() -> mvResults.stream().findFirst())
                                .map(video -> "https://www.youtube.com/embed/" + video.getVideoId())
                                .orElse("https://www.youtube.com/embed/defaultVideoId");

                        List<VideoDto> coverVideos = coverResults.stream()
                                .filter(video -> video.getTitle().toLowerCase().contains("cover"))
                                .limit(3)
                                .collect(Collectors.toList());

                        if (coverVideos.isEmpty()) {
                            coverVideos = coverResults.stream()
                                    .filter(video -> video.getTitle().toLowerCase().contains(trackName.toLowerCase()))
                                    .limit(3)
                                    .collect(Collectors.toList());
                        }

                        // ✅ 응답용 맵 구성 (또는 ResponseDto 만들어도 됨)
                        Map<String, Object> response = new HashMap<>();
                        response.put("track", track);
                        response.put("musicVideo", musicVideo);
                        response.put("coverVideos", coverVideos);

                        return ResponseEntity.ok(response);
                    });
                })
                .onErrorResume(e -> {
                    System.err.println("❌ REST API 에러: " + e.getMessage());
                    Map<String, Object> error = new HashMap<>();
                    error.put("message", "서버 오류: " + e.getMessage());
                    return Mono.just(ResponseEntity.status(500).body(error));
                });
    }
}
