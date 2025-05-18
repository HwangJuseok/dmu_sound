package dmusound.controller;


import dmusound.dto.spotify.SearchResultDto;
import dmusound.service.SpotifyService;
import io.swagger.v3.oas.annotations.*;
import io.swagger.v3.oas.annotations.media.*;
import io.swagger.v3.oas.annotations.responses.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/search")
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

    @GetMapping
    public List<SearchResultDto> search(
            @Parameter(
                    name = "query",
                    description = "Spotify에서 검색할 쿼리 문자열 (예: 'pop', 'BTS', 'IU')",
                    required = true,
                    example = "BTS"
            )
            @RequestParam String query) {

        return spotifyService.search(query);
    }
}
