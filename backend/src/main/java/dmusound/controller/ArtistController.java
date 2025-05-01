package dmusound.controller;

import dmusound.dto.spotify.ArtistDetailDto;
import dmusound.dto.youtube.VideoDto;
import dmusound.service.SpotifyService;
import dmusound.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@Controller
@RequiredArgsConstructor // 생성자 의존성 주입
@RequestMapping("/artist") // "/artist" 경로 요청 처리
public class ArtistController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @GetMapping("/{id}") // 아티스트 상세 페이지 요청 처리
    public Mono<String> artistDetail(@PathVariable String id, Model model) {
        return spotifyService.getArtistDetail(id) // 아티스트 상세 정보 조회
                .flatMap(artist ->
                        youtubeService.getTrackVideos(artist.getName(), "") // 관련 유튜브 영상 조회
                                .map(videos -> {
                                    model.addAttribute("artist", artist); // 아티스트 정보 추가
                                    model.addAttribute("representativeVideo", videos.isEmpty() ? null : videos.get(0)); // 대표 비디오 추가
                                    return "artistDetail"; // 뷰 이름 반환
                                }))
                .onErrorResume(e -> { // 에러 발생 시 처리
                    model.addAttribute("error", "데이터를 가져오는 데 문제가 발생했습니다."); // 에러 메시지 추가
                    return Mono.just("errorPage"); // 에러 페이지 반환
                });
    }
}

