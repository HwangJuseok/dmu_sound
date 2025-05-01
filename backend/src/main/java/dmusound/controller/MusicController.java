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

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor // 생성자 의존성 주입
@RequestMapping("/track") // "/track" 경로 요청 처리
public class MusicController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @GetMapping("/{id}")
    public Mono<String> trackDetail(@PathVariable String id, Model model) {
        return spotifyService.getTrackDetail(id)
                .flatMap(track -> {
                    String trackName = track.getTrackName() != null ? track.getTrackName() : "Unknown Track";
                    String artistName = track.getArtistName() != null ? track.getArtistName() : "Unknown Artist";

                    String officialQuery = artistName + " " + trackName + " official music video";
                    String coverQuery = trackName + " " + artistName + " cover";

                    Mono<List<VideoDto>> officialVideos = youtubeService.searchVideos(officialQuery);
                    Mono<List<VideoDto>> coverVideos = youtubeService.searchVideos(coverQuery);

                    return Mono.zip(officialVideos, coverVideos)
                            .map(tuple -> {
                                // 공식 뮤직비디오: 첫 번째 결과를 선택
                                List<VideoDto> officialVideoList = tuple.getT1();
                                String musicVideo = officialVideoList.stream()
                                        .findFirst()
                                        .map(video -> "https://www.youtube.com/embed/" + video.getVideoId())
                                        .orElse("https://www.youtube.com/embed/defaultVideoId");

                                // 커버 영상: 제목에 'cover'가 포함된 상위 3개
                                List<VideoDto> coverVideoList = tuple.getT2().stream()
                                        .filter(video -> video.getTitle().toLowerCase().contains("cover"))
                                        .limit(3)
                                        .collect(Collectors.toList());

                                model.addAttribute("musicVideo", musicVideo);
                                model.addAttribute("coverVideos", coverVideoList);
                                model.addAttribute("track", track);
                                return "trackDetail";
                            });
                })
                .onErrorResume(e -> {
                    System.err.println("Error during trackDetail processing: " + e.getMessage());
                    e.printStackTrace();
                    model.addAttribute("error", "죄송합니다, 데이터를 가져오는 도중 문제가 발생했습니다. " + e.getMessage());
                    return Mono.just("errorPage");
                });
    }

}