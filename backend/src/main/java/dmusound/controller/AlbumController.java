package dmusound.controller;

import dmusound.dto.spotify.AlbumDetailDto;
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
@RequestMapping("/album") // "/album" 경로 요청 처리
public class AlbumController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @GetMapping("/{id}") // 앨범 상세 페이지 요청 처리
    public Mono<String> albumDetail(@PathVariable String id, Model model) {
        return spotifyService.getAlbumDetail(id) // 앨범 상세 정보 조회
                .flatMap(album -> youtubeService.getTrackVideos(album.getName(), album.getArtistName()) // 관련 유튜브 영상 조회
                        .map(videos -> {
                            model.addAttribute("album", album); // 앨범 정보 추가
                            model.addAttribute("representativeVideo", videos.isEmpty() ? null : videos.get(0)); // 대표 비디오 추가
                            return "albumDetail"; // 뷰 이름 반환
                        }))
                .onErrorResume(e -> { // 에러 발생 시 처리
                    model.addAttribute("error", "데이터를 가져오는 데 문제가 발생했습니다."); // 에러 메시지 추가
                    return Mono.just("errorPage"); // 에러 페이지 반환
                });
    }
}