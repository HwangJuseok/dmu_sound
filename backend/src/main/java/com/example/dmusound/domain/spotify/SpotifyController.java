package com.example.dmusound.domain.spotify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/spotify")
@Tag(name = "Spotify API", description = "Spotify 트랙 검색 및 정보 조회 API")
public class SpotifyController {

    @Autowired
    private SpotifySearchService spotifySearchService;

    @Autowired
    private SpotifyTrackService spotifyTrackService;

    // ✅ 트랙 검색 API
    @GetMapping("/search")
    @Operation(
        summary = "트랙 및 아티스트 검색",
        description = "입력한 쿼리로 아티스트와 트랙을 모두 검색하여 분리된 리스트로 제공합니다."
    )
    public ResponseEntity<Map<String, List<Map<String, Object>>>> searchTrackSeparated(@RequestParam String query) {
        try {
            String decodedQuery = URLDecoder.decode(query, StandardCharsets.UTF_8);
            Map<String, List<Map<String, Object>>> results = spotifySearchService.searchTracksSeparated(decodedQuery);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // ✅ 트랙 상세 정보 API
    @GetMapping("/track/{id}")
    @Operation(
        summary = "트랙 상세 정보 조회",
        description = "Spotify 트랙의 고유 ID를 통해 상세 정보를 조회합니다.\n" +
                      "예: /spotify/track/3n3Ppam7vgaVa1iaRUc9Lp"
    )
    public ResponseEntity<Map<String, Object>> getTrackDetails(
        @Parameter(
            name = "id",
            description = "Spotify 트랙 고유 ID",
            required = true
        )
        @PathVariable String id
    ) {
        try {
            Map<String, Object> trackDetails = spotifyTrackService.getTrackDetails(id);
            return ResponseEntity.ok(trackDetails);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
