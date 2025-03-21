package com.example.dmusound.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class YoutubeService {

    @Value("${youtube.api.key}")  // application.properties에서 키를 가져옴
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String searchVideos(String query) {
        String url = "https://www.googleapis.com/youtube/v3/search"
                + "?part=snippet&type=video&q=" + query + "&key=" + apiKey;

        // API 호출 및 응답 반환
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}