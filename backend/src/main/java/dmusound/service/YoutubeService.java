package dmusound.service;

import com.fasterxml.jackson.databind.JsonNode;
import dmusound.dto.youtube.TrendingVideoDto;
import dmusound.dto.youtube.VideoDto;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor // 생성자 의존성 주입
public class YoutubeService {

    @Value("${youtube.api.key}") // YouTube API Key
    private String apiKey;

    private final WebClient webClient = WebClient.create(); // WebClient 인스턴스 생성

    // ==== 캐시 관련 ====
    private static final long CACHE_TTL_SECONDS = 300; // 5분 TTL
    private final Map<String, CachedResult<List<TrendingVideoDto>>> trendingCache = new ConcurrentHashMap<>();
    private final Map<String, CachedResult<List<VideoDto>>> searchCache = new ConcurrentHashMap<>();

    public Mono<List<TrendingVideoDto>> getTrendingMusic() {
        String cacheKey = "trendingMusic";
        CachedResult<List<TrendingVideoDto>> cached = trendingCache.get(cacheKey);

        if (cached != null && !cached.isExpired()) {
            return Mono.just(cached.getData());
        }

        String url = "https://www.googleapis.com/youtube/v3/videos" +
                "?part=snippet" +
                "&chart=mostPopular" +
                "&videoCategoryId=10" +  // 카테고리 10 = Music
                "&regionCode=KR" +
                "&maxResults=10" +
                "&key=" + apiKey;

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> {
                    List<TrendingVideoDto> trendingVideos = new ArrayList<>();
                    json.get("items").forEach(item -> {
                        JsonNode snippet = item.get("snippet");
                        trendingVideos.add(new TrendingVideoDto(
                                snippet.get("title").asText(),
                                snippet.get("channelTitle").asText(),
                                snippet.get("thumbnails").get("medium").get("url").asText()
                        ));
                    });
                    trendingCache.put(cacheKey, new CachedResult<>(trendingVideos, CACHE_TTL_SECONDS));
                    return trendingVideos;
                });
    }

    /** YouTube에서 특정 트랙과 아티스트 이름으로 비디오 검색 */
    public Mono<List<VideoDto>> getTrackVideos(String track, String artist) {
        String query = (artist != null ? artist : "") + " " + (track != null ? track : "");
        query = query.trim().isEmpty() ? "Default Music Search" : query;

        return searchVideos(query);
    }

    /** YouTube에서 일반 비디오 검색 */
    public Mono<List<VideoDto>> searchVideos(String query) {
        if (query == null || query.trim().isEmpty()) {
            System.err.println("검색어가 비어 있습니다.");
            return Mono.just(List.of()); // 빈 리스트 반환
        }

        // 캐시에서 검색 결과를 먼저 확인합니다.
        CachedResult<List<VideoDto>> cached = searchCache.get(query);
        if (cached != null && !cached.isExpired()) {
            // 캐시된 결과가 있으면 바로 반환
            return Mono.just(cached.getData());
        }

        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String url = "https://www.googleapis.com/youtube/v3/search" +
                "?part=snippet&type=video&maxResults=30&q=" + encodedQuery +
                "&key=" + apiKey;

        System.out.println("YouTube API 요청 URL: " + url);

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> {
                    List<VideoDto> videoList = new ArrayList<>();
                    if (json.has("items")) {
                        json.get("items").forEach(item -> {
                            try {
                                JsonNode snippet = item.get("snippet");
                                videoList.add(new VideoDto(
                                        item.get("id").get("videoId").asText(),
                                        snippet.get("title").asText(),
                                        snippet.get("thumbnails").get("medium").get("url").asText()
                                ));
                            } catch (Exception e) {
                                System.err.println("비디오 정보 처리 중 오류 발생: " + e.getMessage());
                                // 오류가 발생한 비디오는 무시하고 계속 진행
                            }
                        });
                    } else {
                        System.err.println("YouTube API 응답 데이터가 없습니다.");
                    }

                    // 새로운 데이터를 받아왔으므로 캐시에 저장합니다.
                    searchCache.put(query, new CachedResult<>(videoList, CACHE_TTL_SECONDS));
                    return videoList;
                })
                .onErrorResume(e -> {
                    System.err.println("YouTube API 처리 중 에러 발생: " + e.getMessage());
                    return Mono.just(List.of()); // 빈 리스트 반환
                });
    }

    /** 내부 캐시 객체 */
    static class CachedResult<T> {
        @Getter
        private final T data;
        private final Instant expiryTime;

        CachedResult(T data, long ttlSeconds) {
            this.data = data;
            this.expiryTime = Instant.now().plusSeconds(ttlSeconds);
        }

        public boolean isExpired() {
            return Instant.now().isAfter(expiryTime);
        }
    }
}
