package com.example.dmusound.domain.spotify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/spotify")
public class SpotifyController {

    @Autowired
    private SpotifySearchService spotifySearchService;

    @Autowired  // ✅ SpotifyTrackService도 주입해야 함!
    private SpotifyTrackService spotifyTrackService;

    // ✅ 트랙 검색 API
    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchTrack(@RequestParam String query) {
        try {
            String decodedQuery = URLDecoder.decode(query, StandardCharsets.UTF_8);
            List<Map<String, Object>> results = spotifySearchService.searchTracks(decodedQuery);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ✅ 트랙 상세 정보 API
    @GetMapping("/track/{id}")
    public ResponseEntity<Map<String, Object>> getTrackDetails(@PathVariable String id) {
        try {
            Map<String, Object> trackDetails = spotifyTrackService.getTrackDetails(id);
            return ResponseEntity.ok(trackDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
