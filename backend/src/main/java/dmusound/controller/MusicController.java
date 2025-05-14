package dmusound.controller;

import dmusound.dto.spotify.TrackDetailDto;
import dmusound.dto.youtube.VideoDto;
import dmusound.service.SpotifyService;
import dmusound.service.YoutubeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@RequestMapping("/track")
@Tag(name = "MusicController", description = "특정 트랙의 세부 정보를 조회하고 HTML로 렌더링하는 컨트롤러입니다.")
public class MusicController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @Operation(
            summary = "트랙 상세 정보 보기",
            description = """
            주어진 Spotify 트랙 ID를 기반으로 트랙의 세부 정보와 관련된 YouTube 뮤직비디오 및 커버 영상을 가져와 
            트랙 상세 페이지를 렌더링합니다.
            HTML View (`trackDetail.mustache`)를 반환하며, 오류 발생 시 `errorPage.mustache`로 이동합니다.
            """
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "정상적으로 트랙 정보를 조회하여 트랙 상세 페이지 렌더링",
                    content = @Content(
                            mediaType = "text/html",
                            examples = @ExampleObject(name = "트랙 상세 페이지 예시", value = "<html><body>트랙 상세 정보 페이지</body></html>")
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "내부 서버 오류: Spotify API 또는 YouTube 검색 실패",
                    content = @Content(
                            mediaType = "text/html",
                            examples = @ExampleObject(name = "에러 응답", value = "<html><body>오류 페이지</body></html>")
                    )
            )
    })
    @GetMapping("/{id}")
    public Mono<String> trackDetail(@PathVariable String id, Model model) {
        System.out.println("🎯 [트랙 상세 진입] 요청된 트랙 ID: " + id);

        return spotifyService.getTrackDetail(id)
                .flatMap(track -> {
                    String trackName = track.getTrackName() != null ? track.getTrackName() : "Unknown Track";
                    String artistName = track.getArtistName() != null ? track.getArtistName() : "Unknown Artist";
                    System.out.println("🎵 Spotify 트랙 정보: " + trackName + " - " + artistName);


                    Mono<List<VideoDto>> mvSearch = youtubeService.searchVideos(trackName + " " + artistName + " official");
                    Mono<List<VideoDto>> coverSearch = youtubeService.searchVideos(trackName + " " + artistName + " cover");


                    return Mono.zip(mvSearch, coverSearch).map(tuple -> {
                        List<VideoDto> mvResults = tuple.getT1();
                        List<VideoDto> coverResults = tuple.getT2();

                        // 🎬 MV 선택
                        String musicVideo = mvResults.stream()
                                .filter(video -> {
                                    String title = video.getTitle().toLowerCase();
                                    return (title.contains("mv") || title.contains("official")) &&
                                            title.contains(trackName) &&
                                            title.contains(artistName.split(" ")[0]);
                                })
                                .findFirst()
                                .or(() -> mvResults.stream().findFirst())
                                .map(video -> {
                                    System.out.println("✅ 선택된 대표 MV: " + video.getTitle());
                                    return "https://www.youtube.com/embed/" + video.getVideoId();
                                })
                                .orElseGet(() -> {
                                    System.out.println("⚠️ 대표 MV를 찾지 못해 기본값 사용");
                                    return "https://www.youtube.com/embed/defaultVideoId";
                                });

                        // 🎤 Cover 영상 선택
                        List<VideoDto> coverVideos = coverResults.stream()
                                .filter(video -> video.getTitle().toLowerCase().contains("cover"))
                                .limit(3)
                                .collect(Collectors.toList());

                        if (coverVideos.isEmpty()) {
                            System.out.println("⚠️ 'cover' 키워드 포함 영상 없음, fallback 적용");
                            coverVideos = coverResults.stream()
                                    .filter(video -> {
                                        String title = video.getTitle().toLowerCase();
                                        return title.contains(trackName) && title.contains(artistName);
                                    })
                                    .limit(3)
                                    .collect(Collectors.toList());
                        }

                        System.out.println("🎤 선택된 커버 영상:");
                        coverVideos.forEach(v -> System.out.println(" - " + v.getTitle() + " (" + v.getVideoId() + ")"));

                        model.addAttribute("track", track);
                        model.addAttribute("musicVideo", musicVideo);
                        model.addAttribute("coverVideos", coverVideos);

                        return "trackDetail";
                    });
                })
                .onErrorResume(e -> {
                    System.err.println("❌ Error during trackDetail processing: " + e.getMessage());
                    e.printStackTrace();
                    model.addAttribute("error", "죄송합니다, 데이터를 가져오는 도중 문제가 발생했습니다. " + e.getMessage());
                    return Mono.just("errorPage");
                });
    }
}
