package dmusound.controller;

import dmusound.dto.spotify.NewReleaseDto;
import dmusound.service.SpotifyService;
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
@Tag(name = "NewReleaseController", description = "Spotify 신보(New Releases) 데이터를 JSON으로 반환하는 컨트롤러입니다.")
public class NewReleaseController {

    private final SpotifyService spotifyService;

    @Operation(summary = "Spotify 신보 리스트", description = "Spotify에서 최신 앨범들을 조회하여 JSON으로 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "성공적으로 신보 데이터를 반환",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = """
                            [
                              {
                                "id": "123",
                                "name": "New Album",
                                "imageUrl": "https://...",
                                "artistName": "IU"
                              }
                            ]
                            """))
            )
    })
    @GetMapping("/api/spotify/new-releases")
    public Mono<List<NewReleaseDto>> getNewReleases() {
        return spotifyService.getNewReleases();
    }
}
