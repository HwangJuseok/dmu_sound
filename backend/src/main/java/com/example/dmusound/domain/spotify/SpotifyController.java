package com.example.dmusound.domain.spotify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/spotify")
public class SpotifyController {

    @Autowired
    private SpotifyService spotifyService;

    @GetMapping("/token")
    public String getSpotifyToken() {
        return spotifyService.getAccessToken();
    }

    // 새로 추가된 엔드포인트: 곡 이름(query)을 받아서 Spotify에서 검색 후 곡 정보 반환
    @GetMapping("/search")
    public String searchTrack(@RequestParam String query) {
        // 기본값 설정
        if (query == null || query.trim().isEmpty()) {
            query = "Kendrick Lamar Not Like Us";
        }    
        return spotifyService.searchTrack(query);
    }
}
