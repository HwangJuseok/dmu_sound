package com.example.dmusound.domain.spotify;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class SpotifySearchService {

    @Autowired
    private SpotifyService spotifyService;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, List<Map<String, Object>>> searchTracksSeparated(String query) {
        Map<String, List<Map<String, Object>>> resultMap = new HashMap<>();
        resultMap.put("tracks", searchByField(query));    // 트랙 검색
        resultMap.put("artists", searchByArtistId(query));  // 아티스트 검색
        return resultMap;
    }

    private List<Map<String, Object>> searchByArtistId(String query) {
        try {
            String accessToken = spotifyService.getAccessToken();
            // market=KR 추가 (한국 기준으로 검색)
            String artistSearchUrl = "https://api.spotify.com/v1/search?q=" + query + "&type=artist&market=KR&limit=50";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<String> artistResponse = restTemplate.exchange(artistSearchUrl, HttpMethod.GET, request, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode artistItems = objectMapper.readTree(artistResponse.getBody()).path("artists").path("items");

            // 아티스트 정확히 일치하는 것만 필터링
            String lowerQuery = query.toLowerCase();
            JsonNode exactArtist = null;
            for (JsonNode artistItem : artistItems) {
                String artistName = artistItem.path("name").asText();
                if (artistName.toLowerCase().equals(lowerQuery)) {
                    exactArtist = artistItem;
                    break;
                }
            }

            if (exactArtist == null) return Collections.emptyList();

            String artistId = exactArtist.path("id").asText();
            String artistName = exactArtist.path("name").asText();
            // market=KR 추가 (한국 기준으로 아티스트의 top tracks 검색)
            String topTracksUrl = "https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=KR";

            ResponseEntity<String> trackResponse = restTemplate.exchange(topTracksUrl, HttpMethod.GET, request, String.class);
            JsonNode trackItems = objectMapper.readTree(trackResponse.getBody()).path("tracks");

            List<Map<String, Object>> results = new ArrayList<>();
            for (JsonNode item : trackItems) {
                Map<String, Object> trackInfo = new HashMap<>();
                trackInfo.put("id", item.path("id").asText());
                trackInfo.put("name", item.path("name").asText());
                trackInfo.put("artist", artistName);
                trackInfo.put("popularity", item.path("popularity").asInt());
                results.add(trackInfo);
            }

            return results.stream().limit(15).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("아티스트 검색 실패", e);
        }
    }

    private List<Map<String, Object>> searchByField(String query) {
        try {
            String accessToken = spotifyService.getAccessToken();
            
            // 쿼리 파라미터에 직접 한글을 넣고, 이를 그대로 사용합니다.
            String url = "https://api.spotify.com/v1/search?q=" + query + "&type=track&market=KR&limit=50"; // limit 50으로 확장

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            HttpEntity<String> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode items = objectMapper.readTree(response.getBody()).path("tracks").path("items");

            String lowerQuery = query.toLowerCase();
            List<Map<String, Object>> exactMatches = new ArrayList<>();
            List<Map<String, Object>> partialMatches = new ArrayList<>();

            for (JsonNode item : items) {
                String trackName = item.path("name").asText();
                String lowerName = trackName.toLowerCase();

                Map<String, Object> trackInfo = new HashMap<>();
                trackInfo.put("id", item.path("id").asText());
                trackInfo.put("name", trackName);
                trackInfo.put("artist", item.path("artists").get(0).path("name").asText());
                trackInfo.put("popularity", item.path("popularity").asInt());

                if (lowerName.equals(lowerQuery)) {
                    exactMatches.add(trackInfo);
                } else if (lowerName.contains(lowerQuery)) {
                    partialMatches.add(trackInfo);
                }
            }

            // 정확도 그룹별 popularity 순 정렬
            Comparator<Map<String, Object>> byPopularity = 
                Comparator.comparingInt(track -> -(int) track.get("popularity"));

            exactMatches.sort(byPopularity);
            partialMatches.sort(byPopularity);

            // 정확도 높은 항목을 먼저
            List<Map<String, Object>> results = new ArrayList<>();
            results.addAll(exactMatches);
            results.addAll(partialMatches);

            return results.stream().limit(15).collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Spotify 제목 검색 실패", e);
        }
    }
}
