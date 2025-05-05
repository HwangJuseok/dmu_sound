package dmusound.controller;

import dmusound.dto.spotify.NewReleaseDto;
import dmusound.dto.youtube.TrendingVideoDto;
import dmusound.service.SpotifyService;
import dmusound.service.YoutubeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import reactor.core.publisher.Mono;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Tag(name = "HomeController", description = "HTML 뷰로 렌더링되는 홈 화면 (신규 앨범 + 인기 영상)을 반환합니다.")
public class HomeController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @Operation(
            summary = "홈 화면 렌더링",
            description = """
            Spotify의 신보(New Releases)와 YouTube의 인기 음악 영상을 병렬로 가져와 홈 페이지를 렌더링합니다.
            HTML View (`home.mustache`)를 반환합니다.
            """
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "정상적으로 홈 페이지를 렌더링함",
                    content = @Content(
                            mediaType = "text/html",
                            examples = @ExampleObject(name = "홈 HTML 예시", value = "<html><body>홈 페이지</body></html>")
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "내부 오류: 외부 API 실패 또는 처리 중 예외 발생",
                    content = @Content(
                            mediaType = "text/html",
                            examples = @ExampleObject(name = "에러 페이지", value = "<html><body>오류 페이지</body></html>")
                    )
            )
    })
    @GetMapping("/") // 홈 페이지 요청 처리
    public Mono<String> home(Model model) {
        return spotifyService.getNewReleases() // 신규 앨범 정보 조회
                .zipWith(youtubeService.getTrendingMusic()) // 유튜브 인기 영상 조회와 병렬 처리
                .map(result -> {
                    List<NewReleaseDto> newReleases = result.getT1(); // Spotify 데이터
                    List<TrendingVideoDto> trendingVideos = result.getT2(); // YouTube 데이터

                    model.addAttribute("newReleases", newReleases); // 신규 앨범 정보 추가
                    model.addAttribute("trendingVideos", trendingVideos); // 인기 영상 정보 추가
                    return "home"; // 뷰 이름 반환
                })
                .onErrorResume(e -> { // 에러 발생 시 처리
                    model.addAttribute("error", "데이터를 가져오는 데 문제가 발생했습니다."); // 에러 메시지 추가
                    return Mono.just("errorPage"); // 에러 페이지 반환
                });
    }
}
