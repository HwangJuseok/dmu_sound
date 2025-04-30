package dmusound.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dmusound.dto.youtube.TrendingVideoDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class YoutubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private WebClient webClient = WebClient.create();

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
                    JsonNode items = json.get("items");

                    for (JsonNode item : items) {
                        JsonNode snippet = item.get("snippet");

                        TrendingVideoDto dto = new TrendingVideoDto();
                        dto.setTitle(snippet.get("title").asText());
                        dto.setChannel(snippet.get("channelTitle").asText());
                        dto.setThumbnailUrl(snippet.get("thumbnails").get("medium").get("url").asText());

                        trendingVideos.add(dto);
                    }

                    return trendingVideos;
                });
    }
}
