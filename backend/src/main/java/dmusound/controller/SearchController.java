package dmusound.controller;

import dmusound.dto.spotify.SearchResultDto;
import dmusound.service.SpotifyService;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;

import java.util.List;

@Controller
@RequiredArgsConstructor // 생성자 의존성 주입
@Tag(name = "SearchController", description = "사용자가 입력한 쿼리로 Spotify에서 검색 결과를 조회하고 HTML로 렌더링하는 컨트롤러입니다.")
public class SearchController {

    private final SpotifyService spotifyService;

    @Operation(
            summary = "Spotify 검색 결과 조회",
            description = """
            사용자가 입력한 검색어(query)를 기반으로 Spotify에서 검색 결과를 가져오고,
            해당 결과를 HTML로 렌더링하여 `search.mustache` 뷰를 반환합니다.
            """
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "정상적으로 검색 결과를 조회하여 `search.mustache` 뷰 렌더링",
                    content = @Content(
                            mediaType = "text/html",
                            examples = @ExampleObject(name = "검색 결과 페이지 예시", value = "<html><body>검색 결과 페이지</body></html>")
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "내부 서버 오류: 검색 요청 처리 중 문제 발생",
                    content = @Content(
                            mediaType = "text/html",
                            examples = @ExampleObject(name = "에러 응답", value = "<html><body>오류 페이지</body></html>")
                    )
            )
    })
    @GetMapping("/search") // 검색 요청 처리
    public Mono<String> search(
            @Parameter(
                    name = "query",
                    description = "Spotify에서 검색할 쿼리 문자열 (예: 'pop', 'BTS', 'IU')",
                    required = true,
                    example = "BTS"
            ) @RequestParam String query, // 검색어 파라미터
            Model model) {

        return spotifyService.search(query) // 검색 결과 조회
                .map(results -> {
                    model.addAttribute("query", query); // 검색어 추가
                    model.addAttribute("results", results); // 검색 결과 추가
                    return "search"; // 뷰 이름 반환
                })
                .onErrorResume(e -> { // 에러 발생 시 처리
                    model.addAttribute("error", "검색 중 문제가 발생했습니다."); // 에러 메시지 추가
                    return Mono.just("errorPage"); // 에러 페이지 반환
                });
    }
}
