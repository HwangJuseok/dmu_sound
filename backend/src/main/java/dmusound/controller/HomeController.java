package dmusound.controller;

import dmusound.dto.spotify.NewReleaseDto;
import dmusound.dto.youtube.TrendingVideoDto;
import dmusound.service.SpotifyService;
import dmusound.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @GetMapping("/")
    public String home(Model model) {
        List<NewReleaseDto> newReleases = spotifyService.getNewReleases().block(); // 비동기 -> 동기 처리
        List<TrendingVideoDto> trendingVideos = youtubeService.getTrendingMusic().block();

        model.addAttribute("newReleases", newReleases);
        model.addAttribute("trendingVideos", trendingVideos);
        return "home";
    }
}
