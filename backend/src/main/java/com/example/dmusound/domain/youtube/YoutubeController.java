package com.example.dmusound.domain.youtube;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/youtube")
@Tag(name = "YouTube API", description = "YouTube 검색 및 인기 영상 조회 API")
public class YoutubeController {

    @Autowired
    private YoutubeService youtubeService;

    @GetMapping("/search")
    @Operation(
        summary = "유튜브 영상 검색",
        description = "입력된 키워드로 YouTube 영상을 검색합니다.\n예: /api/youtube/search?keyword=아이유"
    )
    public ResponseEntity<String> searchVideos(
        @Parameter(
            name = "keyword",
            description = "검색할 유튜브 영상 키워드 (예: BLACKPINK, 뉴진스)",
            required = true
        )
        @RequestParam String keyword
    ) {
        String response = youtubeService.searchVideos(keyword);

        if (response.contains("error")) {
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/trending")
    @Operation(
        summary = "인기 유튜브 영상 조회",
        description = "현재 YouTube에서 인기 있는 트렌딩 영상을 조회합니다."
    )
    public ResponseEntity<String> getTrendingVideos() {
        String response = youtubeService.getTrendingVideos();

        if (response.contains("error")) {
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.ok(response);
    }
}
