package dmusound.controller;

import dmusound.dto.spotify.NewReleaseDto;
import dmusound.dto.youtube.TrendingVideoDto;
import dmusound.service.SpotifyService;
import dmusound.service.YoutubeService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import reactor.core.publisher.Mono;

import java.util.List;

@Controller
public class HomeController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    public HomeController(SpotifyService spotifyService, YoutubeService youtubeService) {
        this.spotifyService = spotifyService;
        this.youtubeService = youtubeService;
    }

    @GetMapping("/")
    public String home(Model model) {
        Mono<List<NewReleaseDto>> newReleasesMono = spotifyService.getNewReleases();
        Mono<List<TrendingVideoDto>> trendingVideosMono = youtubeService.getTrendingMusic();

        List<NewReleaseDto> newReleases = newReleasesMono.block();
        List<TrendingVideoDto> trendingVideos = trendingVideosMono.block();

        model.addAttribute("newReleases", newReleases);
        model.addAttribute("trendingVideos", trendingVideos);

        return "home";
    }
}