package dmusound.controller;

import dmusound.dto.youtube.TrendingVideoDto;
import dmusound.service.YoutubeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "YoutubeChartController", description = "YouTube 인기 음악 차트를 JSON으로 반환하는 컨트롤러입니다.")
public class YoutubeChartController {

    private final YoutubeService youtubeService;

    @Operation(summary = "YouTube 인기 음악 영상", description = "YouTube에서 인기 음악 영상을 조회하여 JSON으로 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "성공적으로 인기 영상 데이터를 반환",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                            [
                              {
                                "videoId": "abc123",
                                "title": "Top Song",
                                "thumbnailUrl": "https://...",
                                "channelTitle": "Official Channel"
                              }
                            ]
                            """))
            )
    })
    @GetMapping("/api/youtube/trending")
    public Mono<List<TrendingVideoDto>> getTrendingMusic() {
        return youtubeService.getTrendingMusic();
    }
}
