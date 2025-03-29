package com.example.dmusound.domain.youtube.youtube2;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

@Service
public class YouTubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private static final String YOUTUBE_API_URL = "https://www.googleapis.com/youtube/v3/search";

    public String searchVideos(String query) {
        try {
            // 🔹 검색어에 " Cover" 자동 추가
            String searchQuery = query;
            if (!query.toLowerCase().contains("cover")) {
                searchQuery = query + " Cover";
            }
            
            // 🔹 검색어 URL 인코딩 처리
            String encodedQuery = URLEncoder.encode(searchQuery, "UTF-8");
            
            String url = UriComponentsBuilder.fromUriString(YOUTUBE_API_URL)
                .queryParam("part", "snippet")
                .queryParam("q", encodedQuery)  
                .queryParam("type", "video")  //  동영상만 검색
                .queryParam("order", "relevance")  // 연관성 높은 순으로 정렬
                .queryParam("key", apiKey)
                .toUriString();

            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.getForObject(url, String.class);

        } catch (UnsupportedEncodingException e) {
            return "Error: " + e.getMessage();
        }
    }
}
