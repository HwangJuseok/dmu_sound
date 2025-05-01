package dmusound.controller;

import dmusound.dto.spotify.ArtistDetailDto;
import dmusound.service.SpotifyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Controller
@RequiredArgsConstructor
@RequestMapping("/artist")
public class ArtistController {

    private final SpotifyService spotifyService;

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


