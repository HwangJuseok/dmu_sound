package dmusound.controller;

import dmusound.dto.spotify.TrackDetailDto;
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
@RequestMapping("/track") // "/track" 경로 요청 처리
public class MusicController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @GetMapping("/{id}") // 트랙 상세 페이지 요청 처리
    public Mono<String> trackDetail(@PathVariable String id, Model model) {
        return spotifyService.getTrackDetail(id) // 트랙 상세 정보 조회
                .flatMap(track -> {
                    // 검색어 생성
                    String officialQuery = (track.getArtistName() != null ? track.getArtistName() : "") + " " +
                            (track.getTrackName() != null ? track.getTrackName() : "") + " official";
                    officialQuery = officialQuery.trim();

                    String coverQuery = (track.getTrackName() != null ? track.getTrackName() : "Unknown Track") + " " +
                            (track.getArtistName() != null ? track.getArtistName() : "Unknown Artist") + " cover";
                    coverQuery = coverQuery.trim();

                    // 대표 비디오 선정
                    Mono<List<VideoDto>> officialVideos = youtubeService.searchVideos(officialQuery);
                    Mono<List<VideoDto>> coverVideos = youtubeService.searchVideos(coverQuery)
                            .onErrorResume(e -> {
                                System.err.println("Error during cover videos search: " + e.getMessage());
                                return Mono.just(List.of()); // 빈 리스트 반환
                            });

                    return Mono.zip(officialVideos, coverVideos)
                            .map(tuple -> {
                                List<VideoDto> officialVideoList = tuple.getT1(); // 대표 음악 비디오 리스트
                                List<VideoDto> coverVideoList = tuple.getT2(); // 커버 비디오 리스트

                                // 대표 음악 비디오 선정
                                String musicVideo = officialVideoList.stream()
                                        .findFirst()
                                        .map(video -> "https://www.youtube.com/embed/" + video.getVideoId())
                                        .orElse("https://www.youtube.com/embed/defaultVideoId");
                                model.addAttribute("musicVideo", musicVideo);

                                // 커버 비디오 설정
                                List<VideoDto> coverVideoSelection = coverVideoList.stream()
                                        .limit(3) // 최대 3개의 커버 비디오
                                        .toList();
                                model.addAttribute("coverVideos", coverVideoSelection);

                                model.addAttribute("track", track); // 트랙 정보 추가
                                return "trackDetail"; // 뷰 이름 반환
                            });
                })
                .onErrorResume(e -> {
                    // 에러 처리
                    System.err.println("Error during trackDetail processing: " + e.getMessage());
                    e.printStackTrace();
                    model.addAttribute("error", "죄송합니다, 데이터를 가져오는 도중 문제가 발생했습니다. " + e.getMessage());
                    return Mono.just("errorPage");
                });
    }
}