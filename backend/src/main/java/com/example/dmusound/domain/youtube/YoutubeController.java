package com.example.dmusound.domain.youtube;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/youtube")
public class YoutubeController {

    @Autowired
    private YoutubeService youtubeService;

    @GetMapping("/search")
    public ResponseEntity<String> searchVideos(@RequestParam String keyword) {
        String response = youtubeService.searchVideos(keyword);
        
        if (response.contains("error")) {
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/trending")
    public ResponseEntity<String> getTrendingVideos() {
        String response = youtubeService.getTrendingVideos();

        if (response.contains("error")) {
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }
}
