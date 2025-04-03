package com.example.dmusound.domain.spotify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.*;

@Service
public class SpotifySearchService {

    @Autowired
    private SpotifyService spotifyService; // 기존 토큰 서비스 사용

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ✅ 트랙 검색 및 필터링
    public List<Map<String, Object>> searchTracks(String query) {
        String accessToken = spotifyService.getAccessToken();
        String url = UriComponentsBuilder.fromUriString("https://api.spotify.com/v1/search")
                .queryParam("q", query)
                .queryParam("type", "track")
                .queryParam("market", "KR")
                .queryParam("limit", "50")
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        return filterAndSortResults(response.getBody(), query);
    }

    // ✅ 검색 결과 필터링 (유사도 60% 이상 + 인기도 순 정렬)
    private List<Map<String, Object>> filterAndSortResults(String responseBody, String userQuery) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode tracks = root.path("tracks").path("items");
            
            List<Map<String, Object>> results = new ArrayList<>();
            for (JsonNode track : tracks) {
                String trackName = track.path("name").asText();
                String trackId = track.path("id").asText();
                String artistName = track.path("artists").get(0).path("name").asText();
                int popularity = track.path("popularity").asInt();
                
                if (calculateSimilarity(userQuery, trackName) >= 0.6) { // 유사도 60% 이상 필터링
                    Map<String, Object> trackInfo = new HashMap<>();
                    trackInfo.put("id", trackId);
                    trackInfo.put("name", trackName);
                    trackInfo.put("artist", artistName);
                    trackInfo.put("popularity", popularity);
                    results.add(trackInfo);
                }
            }
            
            // 🔥 인기도 기준 정렬 & 최대 10개 제한
            results.sort((a, b) -> Integer.compare((int) b.get("popularity"), (int) a.get("popularity")));
            return results.size() > 10 ? results.subList(0, 10) : results;
        } catch (Exception e) {
            throw new RuntimeException("검색 결과 필터링 실패", e);
        }
    }

    // ✅ 유사도 계산 (Levenshtein 거리 기반)
    private double calculateSimilarity(String input, String target) {
        int distance = levenshteinDistance(input.toLowerCase(), target.toLowerCase());
        int maxLength = Math.max(input.length(), target.length());
        return 1.0 - (double) distance / maxLength;
    }

    private int levenshteinDistance(String a, String b) {
        int[][] dp = new int[a.length() + 1][b.length() + 1];
        for (int i = 0; i <= a.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= b.length(); j++) dp[0][j] = j;

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {
                int cost = (a.charAt(i - 1) == b.charAt(j - 1)) ? 0 : 1;
                dp[i][j] = Math.min(dp[i - 1][j] + 1, Math.min(dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost));
            }
        }
        return dp[a.length()][b.length()];
    }
}