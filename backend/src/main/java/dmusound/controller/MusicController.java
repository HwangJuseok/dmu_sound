package dmusound.controller;

import dmusound.dto.spotify.TrackDetailDto;
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
@RequestMapping("/track")
public class MusicController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @GetMapping("/{id}")
    public String trackDetail(@PathVariable String id, Model model) {
        TrackDetailDto track = spotifyService.getTrackDetail(id).block();
        List<VideoDto> videos = youtubeService.getTrackVideos(track.getTrackName(), track.getArtistName()).block();

        model.addAttribute("track", track);
        model.addAttribute("musicVideo", videos.isEmpty() ? null : videos.get(0));
        model.addAttribute("coverVideos", videos.size() > 1 ? videos.subList(1, Math.min(4, videos.size())) : List.of());

        return "trackDetail";
    }
}