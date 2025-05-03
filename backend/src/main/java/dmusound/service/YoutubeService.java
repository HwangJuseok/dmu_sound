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
import jakarta.annotation.PostConstruct;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class YoutubeService {

    @Value("${youtube.api.keys}")
    private String apiKeyString; // 쉼표로 구분된 API 키들

    private List<String> apiKeys;
    private int currentKeyIndex = 0;

    private final WebClient webClient = WebClient.create();

    private static final long CACHE_TTL_SECONDS = 300; // 캐시 TTL: 5분

    private final Map<String, CachedResult<List<TrendingVideoDto>>> trendingCache = new ConcurrentHashMap<>();
    private final Map<String, CachedResult<List<VideoDto>>> searchCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        this.apiKeys = Arrays.asList(apiKeyString.split(","));
    }

    /** 현재 API 키 반환 */
    private synchronized String getCurrentApiKey() {
        return apiKeys.get(currentKeyIndex);
    }

    /** 다음 키로 전환 */
    private synchronized void switchToNextKey() {
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.size();
        System.out.println("🔁 YouTube API 키 전환됨 → " + getCurrentApiKey());
    }

    /** URL + API 키로 JsonNode 호출 */
    private Mono<JsonNode> getJsonFromUrl(String urlTemplate) {
        String url = urlTemplate + "&key=" + getCurrentApiKey();

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> {
                    System.err.println("❌ API 호출 에러: " + e.getMessage());
                    switchToNextKey(); // 키 변경
                    return Mono.empty();
                });
    }

    /** 인기 음악 가져오기 */
    public Mono<List<TrendingVideoDto>> getTrendingMusic() {
        String cacheKey = "trendingMusic";
        CachedResult<List<TrendingVideoDto>> cached = trendingCache.get(cacheKey);

        if (cached != null && !cached.isExpired()) {
            return Mono.just(cached.getData());
        }

        String url = "https://www.googleapis.com/youtube/v3/videos" +
                "?part=snippet" +
                "&chart=mostPopular" +
                "&videoCategoryId=10" +
                "&regionCode=KR" +
                "&maxResults=10";

        return getJsonFromUrl(url)
                .map(json -> {
                    List<TrendingVideoDto> list = new ArrayList<>();
                    if (json != null && json.has("items")) {
                        json.get("items").forEach(item -> {
                            JsonNode snippet = item.get("snippet");
                            list.add(new TrendingVideoDto(
                                    snippet.get("title").asText(),
                                    snippet.get("channelTitle").asText(),
                                    snippet.get("thumbnails").get("medium").get("url").asText()
                            ));
                        });
                        trendingCache.put(cacheKey, new CachedResult<>(list, CACHE_TTL_SECONDS));
                    }
                    return list;
                })
                .defaultIfEmpty(List.of());
    }

    /** 트랙 + 아티스트로 비디오 검색 */
    public Mono<List<VideoDto>> getTrackVideos(String track, String artist) {
        String query = (artist != null ? artist : "") + " " + (track != null ? track : "");
        query = query.trim().isEmpty() ? "Default Music Search" : query;

        return searchVideos(query);
    }

    /** 일반 검색 */
    public Mono<List<VideoDto>> searchVideos(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Mono.just(List.of());
        }

        CachedResult<List<VideoDto>> cached = searchCache.get(query);
        if (cached != null && !cached.isExpired()) {
            return Mono.just(cached.getData());
        }

        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String url = "https://www.googleapis.com/youtube/v3/search" +
                "?part=snippet&type=video&maxResults=10&q=" + encodedQuery;

        return getJsonFromUrl(url)
                .map(json -> {
                    List<VideoDto> list = new ArrayList<>();
                    if (json != null && json.has("items")) {
                        json.get("items").forEach(item -> {
                            try {
                                JsonNode snippet = item.get("snippet");
                                list.add(new VideoDto(
                                        item.get("id").get("videoId").asText(),
                                        snippet.get("title").asText(),
                                        snippet.get("thumbnails").get("medium").get("url").asText()
                                ));
                            } catch (Exception e) {
                                System.err.println("⚠️ 비디오 처리 오류: " + e.getMessage());
                            }
                        });
                        searchCache.put(query, new CachedResult<>(list, CACHE_TTL_SECONDS));
                    }
                    return list;
                })
                .defaultIfEmpty(List.of());
    }

    /** 캐시 객체 */
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
