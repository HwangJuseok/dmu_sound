package dmusound.controller;

import dmusound.dto.spotify.ArtistDetailDto;
import dmusound.dto.youtube.VideoDto;
import dmusound.service.SpotifyService;
import dmusound.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping("/artist")
public class ArtistController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @GetMapping("/{id}")
    public String artistDetail(@PathVariable String id, Model model) {
        ArtistDetailDto artist = spotifyService.getArtistDetail(id).block();
        List<VideoDto> videos = youtubeService.getTrackVideos(artist.getName(), "").block();

        model.addAttribute("artist", artist);
        model.addAttribute("representativeVideo", videos.isEmpty() ? null : videos.get(0));

        return "artistDetail";
    }
}

