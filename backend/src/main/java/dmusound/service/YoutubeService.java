package dmusound.service;

import com.fasterxml.jackson.databind.JsonNode;
import dmusound.dto.youtube.TrendingVideoDto;
import dmusound.dto.youtube.VideoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor // 생성자 의존성 주입
public class YoutubeService {

    @Value("${youtube.api.key}") // YouTube API Key
    private String apiKey;

    private final WebClient webClient = WebClient.create(); // WebClient 인스턴스 생성

    public Mono<List<TrendingVideoDto>> getTrendingMusic() {
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

        String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
        String url = "https://www.googleapis.com/youtube/v3/search" +
                "?part=snippet&type=video&maxResults=4&q=" + encodedQuery +
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
                            JsonNode snippet = item.get("snippet");
                            videoList.add(new VideoDto(
                                    item.get("id").get("videoId").asText(),
                                    snippet.get("title").asText(),
                                    snippet.get("thumbnails").get("medium").get("url").asText()
                            ));
                        });
                    } else {
                        System.err.println("YouTube API 응답 데이터가 없습니다.");
                    }
                    return videoList;
                })
                .onErrorResume(e -> {
                    System.err.println("YouTube API 처리 중 에러 발생: " + e.getMessage());
                    return Mono.just(List.of()); // 빈 리스트 반환
                });
    }
}