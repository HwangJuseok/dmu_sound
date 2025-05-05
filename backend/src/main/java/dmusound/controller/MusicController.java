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

/**
 * MusicController는 특정 트랙의 세부 정보를 조회하고 HTML로 렌더링하는 컨트롤러입니다.
 */
@Controller
@RequiredArgsConstructor // 생성자 의존성 주입
@RequestMapping("/track") // "/track" 경로 요청 처리
@Tag(name = "MusicController", description = "특정 트랙의 세부 정보를 조회하고 HTML로 렌더링하는 컨트롤러입니다.")
public class MusicController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    /**
     * 트랙의 상세 정보를 조회하고 YouTube에서 관련 뮤직비디오 및 커버 영상 정보를 가져옵니다.
     * @param id 트랙의 Spotify ID
     * @param model 뷰에 데이터를 전달할 Model 객체
     * @return 트랙 상세 페이지 렌더링
     */
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
    public Mono<String> trackDetail(
            @Parameter(
                    name = "id",
                    description = "Spotify 트랙 ID (예: 3Nrfpe0tUJi4K4DXYWgMUX)",
                    required = true,
                    example = "3Nrfpe0tUJi4K4DXYWgMUX"
            ) @PathVariable String id, // 트랙 ID 파라미터
            Model model) {

        return spotifyService.getTrackDetail(id) // Spotify에서 트랙 세부 정보 가져오기
                .flatMap(track -> {
                    String trackName = track.getTrackName() != null ? track.getTrackName() : "Unknown Track";
                    String artistName = track.getArtistName() != null ? track.getArtistName() : "Unknown Artist";

                    // YouTube에서 해당 트랙의 공식 뮤직비디오와 커버 영상 검색
                    String officialQuery = artistName + " " + trackName + " official music video";
                    String coverQuery = trackName + " " + artistName + " cover";

                    Mono<List<VideoDto>> officialVideos = youtubeService.searchVideos(officialQuery);
                    Mono<List<VideoDto>> coverVideos = youtubeService.searchVideos(coverQuery);

                    return Mono.zip(officialVideos, coverVideos) // YouTube 검색 결과 합치기
                            .map(tuple -> {
                                List<VideoDto> officialVideoList = tuple.getT1();
                                List<VideoDto> coverCandidates = tuple.getT2();

                                String loweredTrack = trackName.toLowerCase();
                                String loweredArtist = artistName.toLowerCase();

                                // ✅ 공식 MV: 제목에 "official" 또는 "MV"가 포함된 것 우선 필터링
                                String musicVideo = officialVideoList.stream()
                                        .filter(video -> {
                                            String title = video.getTitle().toLowerCase();
                                            return (title.contains("mv") || title.contains("official"))
                                                    && (title.contains(loweredTrack) || title.contains(loweredTrack.replaceAll("[^a-zA-Z0-9]", "")))
                                                    && title.contains(loweredArtist.split(" ")[0]);
                                        })
                                        .findFirst()
                                        .or(() -> officialVideoList.stream().findFirst()) // fallback
                                        .map(video -> "https://www.youtube.com/embed/" + video.getVideoId())
                                        .orElse("https://www.youtube.com/embed/defaultVideoId");

                                // ✅ 커버 영상 2단계 필터링
                                List<VideoDto> filteredCovers = coverCandidates.stream()
                                        .filter(video -> video.getTitle().toLowerCase().contains("cover"))
                                        .limit(3)
                                        .collect(Collectors.toList());

                                if (filteredCovers.isEmpty()) {
                                    filteredCovers = coverCandidates.stream()
                                            .filter(video -> {
                                                String title = video.getTitle().toLowerCase();
                                                return title.contains(trackName.toLowerCase()) &&
                                                        title.contains(artistName.toLowerCase());
                                            })
                                            .limit(3)
                                            .collect(Collectors.toList());
                                }

                                model.addAttribute("musicVideo", musicVideo);
                                model.addAttribute("coverVideos", filteredCovers);
                                model.addAttribute("track", track);
                                return "trackDetail";
                            });
                })
                .onErrorResume(e -> { // 에러 처리
                    System.err.println("Error during trackDetail processing: " + e.getMessage());
                    e.printStackTrace();
                    model.addAttribute("error", "죄송합니다, 데이터를 가져오는 도중 문제가 발생했습니다. " + e.getMessage());
                    return Mono.just("errorPage"); // 에러 페이지 반환
                });
    }
}
