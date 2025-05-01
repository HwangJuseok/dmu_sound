package dmusound.controller;

import dmusound.dto.spotify.AlbumDetailDto;
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
@RequestMapping("/album")
public class AlbumController {

    private final SpotifyService spotifyService;
    private final YoutubeService youtubeService;

    @GetMapping("/{id}")
    public String albumDetail(@PathVariable String id, Model model) {
        AlbumDetailDto album = spotifyService.getAlbumDetail(id).block();
        List<VideoDto> videos = youtubeService.getTrackVideos(album.getName(), album.getArtistName()).block();

        model.addAttribute("album", album);
        model.addAttribute("representativeVideo", videos.isEmpty() ? null : videos.get(0));

        return "albumDetail";
    }
}