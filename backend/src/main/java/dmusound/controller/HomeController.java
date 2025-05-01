package dmusound.controller;

import dmusound.dto.spotify.NewReleaseDto;
import dmusound.dto.youtube.TrendingVideoDto;
import dmusound.service.SpotifyService;
import dmusound.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import reactor.core.publisher.Mono;

import java.util.List;

@Controller
@RequiredArgsConstructor // 생성자 의존성 주입
public class HomeController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

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