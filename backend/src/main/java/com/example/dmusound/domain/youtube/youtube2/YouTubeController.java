package com.example.dmusound.domain.youtube.youtube2;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
@CrossOrigin(origins = "http://localhost:3000")
@RestController  // ✅ JSON 응답을 반환하도록 변경
@RequestMapping("/api/youtube")  // ✅ API 엔드포인트 명시
public class YouTubeController {

    @Autowired
    private YouTubeService youTubeService;

    @GetMapping("/music_search")
    public ResponseEntity<?> search(@RequestParam("keyword") String keyword) {
        try {
            // 유튜브 API 호출
            String jsonResponse = youTubeService.searchVideos(keyword);

            // JSON 변환 및 반환
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            return ResponseEntity.ok(rootNode);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("YouTube API 응답 파싱 중 오류 발생");
        }
    }
}