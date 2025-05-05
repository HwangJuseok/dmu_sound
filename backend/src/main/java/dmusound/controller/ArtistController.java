package dmusound.controller;

import dmusound.dto.spotify.ArtistDetailDto;
import dmusound.service.SpotifyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Controller
@RequiredArgsConstructor
@RequestMapping("/artist")
@Tag(name = "ArtistController", description = "웹 브라우저에서 아티스트 정보를 조회하고 HTML로 렌더링하는 컨트롤러입니다.")
public class ArtistController {

    private final SpotifyService spotifyService;

    @Operation(
            summary = "아티스트 상세 페이지 보기",
            description = """
        주어진 Spotify 아티스트 ID를 기반으로 아티스트 상세 정보와 인기 트랙을 조회하여 웹 페이지에 렌더링합니다.
        HTML View (artistDetail.mustache)을 반환하며, 오류 발생 시 errorPage.mustache로 이동합니다.
        """,
            parameters = {
                    @Parameter(
                            name = "id",
                            description = "Spotify 아티스트 ID (예: BTS, IU 등의 고유 식별자)",
                            required = true,
                            example = "3Nrfpe0tUJi4K4DXYWgMUX",
                            schema = @Schema(type = "string")
                    )
            }
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "정상적으로 아티스트 정보를 조회하여 View를 렌더링함",
                    content = @Content(
                            mediaType = "text/html",
                            examples = @ExampleObject(name = "성공 응답", value = "<html><body>아티스트 상세 페이지</body></html>")
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "내부 서버 오류: Spotify API 또는 응답 처리 실패",
                    content = @Content(
                            mediaType = "text/html",
                            examples = @ExampleObject(name = "에러 응답", value = "<html><body>오류 페이지</body></html>")
                    )
            )
    })
    @GetMapping("/{id}")
    public Mono<String> artistDetail(@PathVariable String id, Model model) {
        return spotifyService.getArtistDetail(id)
                .map(artist -> {
                    model.addAttribute("artist", artist); // ArtistDetailDto
                    model.addAttribute("topTracks", artist.getSafeTopTracks()); // Top tracks
                    return "artistDetail";
                })
                .onErrorResume(e -> {
                    model.addAttribute("error", "데이터를 가져오는 데 문제가 발생했습니다.");
                    return Mono.just("errorPage");
                });
    }
}