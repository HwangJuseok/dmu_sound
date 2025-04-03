package com.example.dmusound.domain.youtube;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@Service
public class YoutubeService {

    @Value("${youtube.api.key}")  // application.properties에서 키를 가져옴
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ 캐싱 적용 (요청 횟수 줄이기)
    private Map<String, String> cache = new HashMap<>();

    // 🔍 특정 키워드로 유튜브 검색
    public String searchVideos(String query) {
        if (cache.containsKey(query)) {
            return cache.get(query); // 📌 캐싱된 데이터 반환
        }

        String url = "https://www.googleapis.com/youtube/v3/search"
                + "?part=snippet&type=video&q=" + query + "&maxResults=3&key=" + apiKey; // 🔥 maxResults=3으로 줄이기

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            cache.put(query, response.getBody()); // ✅ 캐시에 저장
            return response.getBody();
        } catch (Exception e) {
            System.err.println("유튜브 검색 오류: " + e.getMessage());
            return "{\"error\": \"유튜브 데이터를 불러올 수 없습니다.\"}";
        }
    }

    // 🔥 유튜브 인기 음악 차트 가져오기
    public String getTrendingVideos() {
        String cacheKey = "youtube_trending";
        if (cache.containsKey(cacheKey)) {
            return cache.get(cacheKey);
        }

        String url = "https://www.googleapis.com/youtube/v3/videos"
                + "?part=snippet,statistics"
                + "&chart=mostPopular"
                + "&videoCategoryId=10"
                + "&maxResults=10"
                + "&regionCode=KR"
                + "&key=" + apiKey;

        try {
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            cache.put(cacheKey, response.getBody()); // ✅ 캐시에 저장
            return response.getBody();
        } catch (Exception e) {
            System.err.println("유튜브 인기 차트 오류: " + e.getMessage());
            return "{\"error\": \"유튜브 인기 차트를 불러올 수 없습니다.\"}";
        }
    }
}
