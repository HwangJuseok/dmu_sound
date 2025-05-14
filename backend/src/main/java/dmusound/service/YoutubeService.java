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

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class YoutubeService {

    @Value("${youtube.api.keys}")
    private String apiKeyString;

    private List<String> apiKeys;
    private int currentKeyIndex = 0;

    private final WebClient webClient = WebClient.create();

    private static final long CACHE_TTL_SECONDS = 300;

    private final Map<String, CachedResult<List<TrendingVideoDto>>> trendingCache = new ConcurrentHashMap<>();
    private final Map<String, CachedResult<List<VideoDto>>> searchCache = new ConcurrentHashMap<>();

    @PostConstruct
    public void init() {
        this.apiKeys = Arrays.asList(apiKeyString.split(","));
    }

    private synchronized String getCurrentApiKey() {
        return apiKeys.get(currentKeyIndex);
    }

    private synchronized void switchToNextKey() {
        currentKeyIndex = (currentKeyIndex + 1) % apiKeys.size();
        System.out.println("🔁 YouTube API 키 전환됨 → " + getCurrentApiKey());
    }

    private Mono<JsonNode> getJsonFromUrl(String urlTemplate) {
        String url = urlTemplate + "&key=" + getCurrentApiKey();

        return webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .onErrorResume(e -> {
                    System.err.println("❌ API 호출 에러: " + e.getMessage());
                    switchToNextKey();
                    return Mono.empty();
                });
    }

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

    public Mono<List<VideoDto>> searchVideos(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Mono.just(List.of());
        }

        // 캐시 체크
        CachedResult<List<VideoDto>> cached = searchCache.get(query);
        if (cached != null && !cached.isExpired()) {
            return Mono.just(cached.getData());
        }

        try {
            // 인코딩 없이 쿼리 그대로 사용
            String url = "https://www.googleapis.com/youtube/v3/search" +
                    "?part=snippet&type=video&maxResults=10&q=" + query;

            return getJsonFromUrl(url)
                    .map(json -> {
                        List<VideoDto> list = new ArrayList<>();
                        if (json != null && json.has("items")) {
                            json.get("items").forEach(item -> {
                                try {
                                    JsonNode snippet = item.get("snippet");
                                    String videoId = item.get("id").get("videoId").asText();
                                    String title = snippet.get("title").asText();
                                    String thumbnailUrl = snippet.get("thumbnails").get("medium").get("url").asText();

                                    list.add(new VideoDto(videoId, title, thumbnailUrl));
                                } catch (Exception e) {
                                    System.err.println("⚠️ 비디오 처리 오류: " + e.getMessage());
                                }
                            });

                            // 캐시 저장
                            searchCache.put(query, new CachedResult<>(list, CACHE_TTL_SECONDS));
                        }
                        return list;
                    })
                    .defaultIfEmpty(List.of());

        } catch (Exception e) {
            e.printStackTrace();
            return Mono.just(List.of());  // 예외 발생 시 빈 리스트 반환
        }
    }



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
