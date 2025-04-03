package com.example.dmusound.domain.spotify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;

@Service
public class SpotifyTrackService {

    @Autowired
    private SpotifyService spotifyService; // 기존 토큰 관리 서비스

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getTrackDetails(String trackId) {
        String accessToken = spotifyService.getAccessToken(); // 토큰 가져오기
        String url = "https://api.spotify.com/v1/tracks/" + trackId;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode root = objectMapper.readTree(response.getBody());

            Map<String, Object> trackInfo = new HashMap<>();
            trackInfo.put("id", root.path("id").asText());
            trackInfo.put("name", root.path("name").asText());
            trackInfo.put("artists", root.path("artists"));
            trackInfo.put("album", root.path("album"));
            trackInfo.put("popularity", root.path("popularity").asInt());
            trackInfo.put("preview_url", root.path("preview_url").asText());

            return trackInfo;
        } catch (Exception e) {
            throw new RuntimeException("트랙 상세 정보 파싱 실패", e);
        }
    }
}
