package com.example.dmusound.domain.youtube;

import com.example.dmusound.domain.youtube.YoutubeService;
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
        return ResponseEntity.ok(response);
    }

     // 🔥 유튜브 인기 차트 가져오기 (새로운 API 추가)
    @GetMapping("/trending")
    public ResponseEntity<String> getTrendingVideos() {
         String response = youtubeService.getTrendingVideos();
         return ResponseEntity.ok(response);
    }
    
}