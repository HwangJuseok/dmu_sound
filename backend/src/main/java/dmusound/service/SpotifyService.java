package dmusound.service;

import dmusound.dto.spotify.*;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Spotify API와 통신하여 데이터를 처리하는 서비스 클래스.
 */
@Service
@RequiredArgsConstructor // 생성자 의존성 주입
public class SpotifyService {

    @Value("${spotify.client.id}") // Spotify Client ID
    private String clientId;

    @Value("${spotify.client.secret}") // Spotify Client Secret
    private String clientSecret;

    private final WebClient webClient = WebClient.create(); // WebClient 인스턴스 생성

    /**
     * Spotify Access Token 발급.
     * @return Access Token을 포함하는 Mono<String>
     */
    private Mono<String> getAccessToken() {
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>(); // LinkedMultiValueMap 사용
        formData.add("grant_type", "client_credentials");

        return webClient.post()
                .uri("https://accounts.spotify.com/api/token")
                .headers(headers -> headers.setBasicAuth(clientId, clientSecret))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData)) // LinkedMultiValueMap을 BodyInserters에 전달
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(json -> json.get("access_token").asText());
    }

    /**
     * 신곡 정보 가져오기.
     * @return 신곡 정보를 포함하는 Mono<List<NewReleaseDto>>
     */
    public Mono<List<NewReleaseDto>> getNewReleases() {
        return getAccessToken().flatMap(token ->
                webClient.get()
                        .uri("https://api.spotify.com/v1/browse/new-releases?country=KR&limit=10")
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .flatMapMany((JsonNode json) -> {
                            JsonNode items = json.get("albums").get("items");
                            List<Mono<NewReleaseDto>> monoList = new ArrayList<>();

                            for (JsonNode item : items) {
                                String albumId = item.get("id").asText();
                                String albumName = item.get("name").asText();
                                String artistName = item.get("artists").get(0).get("name").asText();
                                String imageUrl = item.get("images").get(0).get("url").asText();

                                Mono<NewReleaseDto> dtoMono = webClient.get()
                                        .uri("https://api.spotify.com/v1/albums/" + albumId + "/tracks?limit=1")
                                        .headers(headers -> headers.setBearerAuth(token)) // token 스코프 문제 해결됨
                                        .retrieve()
                                        .bodyToMono(JsonNode.class)
                                        .map(trackJson -> {
                                            JsonNode track = trackJson.get("items").get(0);
                                            String trackId = track.get("id").asText();
                                            return new NewReleaseDto(albumName, artistName, imageUrl, trackId);
                                        });

                                monoList.add(dtoMono);
                            }

                            return Flux.merge(monoList); // Flux<NewReleaseDto>
                        })
                        .collectList() // Mono<List<NewReleaseDto>>
        );
    }


    /**
     * 검색 결과 가져오기 (트랙 및 아티스트).
     * @param query 검색어
     * @return 검색 결과를 포함하는 Mono<List<SearchResultDto>>
     */
    public List<SearchResultDto> search(String query) {
        String token = getAccessToken().block(); // 동기 방식 호출
        List<SearchResultDto> results = new ArrayList<>();

        // Track 검색
        JsonNode trackResponse = webClient.get()
                .uri("https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=5")
                .headers(headers -> headers.setBearerAuth(token))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (trackResponse != null && trackResponse.has("tracks")) {
            for (JsonNode item : trackResponse.get("tracks").get("items")) {
                String id = item.get("id").asText();
                String name = item.get("name").asText();
                String artist = item.get("artists").get(0).get("name").asText();
                String imageUrl = item.get("album").get("images").get(0).get("url").asText();

                results.add(new SearchResultDto(id, "track", name, artist, imageUrl));
            }
        }

        // Artist 검색
        JsonNode artistResponse = webClient.get()
                .uri("https://api.spotify.com/v1/search?q=" + query + "&type=artist&limit=5")
                .headers(headers -> headers.setBearerAuth(token))
                .retrieve()
                .bodyToMono(JsonNode.class)
                .block();

        if (artistResponse != null && artistResponse.has("artists")) {
            for (JsonNode item : artistResponse.get("artists").get("items")) {
                String id = item.get("id").asText();
                String name = item.get("name").asText();
                String imageUrl = item.get("images").size() > 0 ? item.get("images").get(0).get("url").asText() : "";

                results.add(new SearchResultDto(id, "artist", name, "Artist", imageUrl));
            }
        }

        return results;
    }

    /**
     * 특정 트랙 세부 정보 가져오기.
     * @param trackId 트랙 ID
     * @return 트랙 세부 정보를 포함하는 Mono<TrackDetailDto>
     */
    public Mono<TrackDetailDto> getTrackDetail(String trackId) {
        return getAccessToken().flatMap(token ->
                webClient.get()
                        .uri("https://api.spotify.com/v1/tracks/" + trackId)
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .map(json -> new TrackDetailDto(
                                json.get("id").asText(),
                                json.get("name").asText(),
                                json.get("artists").get(0).get("id").asText(),
                                json.get("artists").get(0).get("name").asText(),
                                json.get("album").get("id").asText(),
                                json.get("album").get("name").asText(),
                                json.get("album").get("images").get(0).get("url").asText(),
                                json.get("preview_url").asText("")
                        ))
        );
    }

    /**
     * 특정 아티스트 세부 정보 가져오기.
     * @param artistId 아티스트 ID
     * @return 아티스트 세부 정보를 포함하는 Mono<ArtistDetailDto>
     */
    public Mono<ArtistDetailDto> getArtistDetail(String artistId) {
        return getAccessToken().flatMap(token ->
                webClient.get()
                        .uri("https://api.spotify.com/v1/artists/" + artistId)
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .flatMap(artistJson -> webClient.get()
                                .uri("https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=KR")
                                .headers(headers -> headers.setBearerAuth(token))
                                .retrieve()
                                .bodyToMono(JsonNode.class)
                                .map(topTracksJson -> {
                                    List<TrackDetailDto> topTracks = new ArrayList<>();
                                    topTracksJson.get("tracks").forEach(track -> topTracks.add(new TrackDetailDto(
                                            track.get("id").asText(),
                                            track.get("name").asText(),
                                            artistId,
                                            artistJson.get("name").asText(),
                                            track.get("album").get("id").asText(),
                                            track.get("album").get("name").asText(),
                                            track.get("album").get("images").get(0).get("url").asText(),
                                            track.get("preview_url").asText("")
                                    )));

                                    return new ArtistDetailDto(
                                            artistJson.get("id").asText(),
                                            artistJson.get("name").asText(),
                                            artistJson.has("images") && artistJson.get("images").size() > 0 ?
                                                    artistJson.get("images").get(0).get("url").asText() : "",
                                            topTracks
                                    );
                                })
                        )
        );
    }

    public Mono<TrackDetailDto> fetchTrack(String title, String artist) {
        String query = title + " " + artist;

        return getAccessToken().flatMap(token ->
                webClient.get()
                        .uri("https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=1")
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .flatMap(json -> {
                            JsonNode items = json.get("tracks").get("items");
                            if (items.isArray() && items.size() > 0) {
                                JsonNode track = items.get(0);
                                TrackDetailDto dto = new TrackDetailDto(
                                        track.get("id").asText(),
                                        track.get("name").asText(),
                                        track.get("artists").get(0).get("id").asText(),
                                        track.get("artists").get(0).get("name").asText(),
                                        track.get("album").get("id").asText(),
                                        track.get("album").get("name").asText(),
                                        track.get("album").get("images").get(0).get("url").asText(),
                                        track.has("preview_url") && !track.get("preview_url").isNull()
                                                ? track.get("preview_url").asText() : null
                                );
                                return Mono.just(dto);
                            } else {
                                return Mono.empty();
                            }
                        })
        );
    }




}