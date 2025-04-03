package com.example.dmusound.domain.youtube;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class YoutubeService {

    @Value("${youtube.api.key}")  // application.properties에서 키를 가져옴
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // 🔍 특정 키워드로 유튜브 검색
    public String searchVideos(String query) {
        String url = "https://www.googleapis.com/youtube/v3/search"
                + "?part=snippet&type=video&q=" + query + "&maxResults=5&key=" + apiKey;

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    // 🔥 유튜브 인기 음악 차트 가져오기
    public String getTrendingVideos() {
        String url = "https://www.googleapis.com/youtube/v3/videos"
                + "?part=snippet,statistics" // 기본 정보 + 조회수 포함
                + "&chart=mostPopular"       // 인기 영상 차트
                + "&videoCategoryId=10"      // 카테고리 10: 음악 (Music)
                + "&maxResults=10"           // 상위 10개 영상 가져오기
                + "&regionCode=KR"           // 한국 인기 차트
                + "&key=" + apiKey;

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}