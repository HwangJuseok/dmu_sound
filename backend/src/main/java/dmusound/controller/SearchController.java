package dmusound.controller;

import dmusound.dto.spotify.SearchResultDto;
import dmusound.service.SpotifyService;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@Slf4j // 로깅 추가
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // 추가 CORS 설정
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
                    description = "정상적으로 검색 결과를 조회하여 검색 결과 반환",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(name = "검색 결과 예시", value = "[{\"id\":\"1\",\"name\":\"BTS\"}]")
                    )
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "내부 서버 오류: 검색 요청 처리 중 문제 발생",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(name = "에러 응답", value = "{\"error\":\"Internal Server Error\"}")
                    )
            )
    })
    @GetMapping
    public Mono<List<SearchResultDto>> search(
            @Parameter(
                    name = "query",
                    description = "Spotify에서 검색할 쿼리 문자열 (예: 'pop', 'BTS', 'IU')",
                    required = true,
                    example = "BTS"
            )
            @RequestParam String query) {

        log.info("🔍 검색 요청 받음: query = {}", query); // 로그 추가

        return spotifyService.search(query)
                .doOnNext(results -> log.info("✅ 검색 결과 개수: {}", results.size()))
                .doOnError(e -> log.error("❌ 검색 중 오류 발생: ", e));
    }
}