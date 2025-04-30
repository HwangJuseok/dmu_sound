package dmusound.service;

import dmusound.dto.spotify.NewReleaseDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SpotifyService {

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private WebClient webClient = WebClient.create();

    // Spotify Access Token 발급
    private Mono<String> getAccessToken() {
        return webClient.post()
                .uri("https://accounts.spotify.com/api/token")
                .headers(headers -> headers.setBasicAuth(clientId, clientSecret))
                .bodyValue("grant_type=client_credentials")
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> json.get("access_token").asText());
    }

    // 신곡 정보 가져오기
    public Mono<List<NewReleaseDto>> getNewReleases() {
        return getAccessToken().flatMap(token ->
                webClient.get()
                        .uri("https://api.spotify.com/v1/browse/new-releases?country=KR&limit=10")
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .map(json -> {
                            List<NewReleaseDto> releases = new ArrayList<>();
                            JsonNode items = json.get("albums").get("items");
                            for (JsonNode item : items) {
                                NewReleaseDto dto = new NewReleaseDto();
                                dto.setAlbumName(item.get("name").asText());
                                dto.setImageUrl(item.get("images").get(0).get("url").asText());
                                dto.setArtistName(item.get("artists").get(0).get("name").asText());
                                releases.add(dto);
                            }
                            return releases;
                        })
        );
    }
}
