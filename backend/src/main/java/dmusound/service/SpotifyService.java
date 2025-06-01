package dmusound.service;

import com.github.benmanes.caffeine.cache.Cache;
import com.fasterxml.jackson.databind.JsonNode;
import dmusound.dto.spotify.*;
import dmusound.properties.SpotifyProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class SpotifyService {

    private final SpotifyProperties spotifyProperties;
    private final Cache<String, List<NewReleaseDto>> newReleasesCache;
    private final WebClient webClient = WebClient.create();

    private int clientIndex = 0;

    private final Map<String, Long> blockedClients = new ConcurrentHashMap<>();

    private boolean isBlocked(String clientId) {
        Long blockedUntil = blockedClients.get(clientId);
        return blockedUntil != null && blockedUntil > System.currentTimeMillis();
    }

    private void blockClient(String clientId, int seconds) {
        blockedClients.put(clientId, System.currentTimeMillis() + seconds * 1000L);
    }

    private String cachedToken;
    private long tokenExpireTime;

    private SpotifyProperties.Client getNextClient() {
        List<SpotifyProperties.Client> clients = spotifyProperties.getClients();
        SpotifyProperties.Client selected = clients.get(clientIndex);
        clientIndex = (clientIndex + 1) % clients.size();
        return selected;
    }

    private Mono<TokenResponse> getAccessTokenFromSpotify(int attempt) {
        List<SpotifyProperties.Client> clients = spotifyProperties.getClients();
        if (attempt >= clients.size()) {
            return Mono.error(new RuntimeException("모든 Spotify 클라이언트 토큰 요청 실패"));
        }

        SpotifyProperties.Client client = clients.get(attempt);
        if (isBlocked(client.getId())) {
            System.out.println("클라이언트 " + client.getId() + " 블락 상태, 다음 키로 시도합니다.");
            return getAccessTokenFromSpotify(attempt + 1);
        }

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "client_credentials");

        return webClient.post()
                .uri("https://accounts.spotify.com/api/token")
                .headers(headers -> headers.setBasicAuth(client.getId(), client.getSecret()))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
                .retrieve()
                .onStatus(status -> status.value() == 429, response -> {
                    System.out.println("클라이언트 " + client.getId() + " 429 오류로 블락됨.");
                    blockClient(client.getId(), 60); // 60초 동안 블락
                    return Mono.error(new RuntimeException("429 Too Many Requests - 블락됨"));
                })
                .bodyToMono(JsonNode.class)
                .map(json -> new TokenResponse(json.get("access_token").asText(), json.get("expires_in").asLong()))
                        .onErrorResume(e -> getAccessTokenFromSpotify(attempt + 1));
    }


    private Mono<String> getCachedAccessToken() {
        long now = System.currentTimeMillis();
        if (cachedToken != null && now < tokenExpireTime) {
            return Mono.just(cachedToken);
        }
        return getAccessTokenFromSpotify(0).map(token -> {
            cachedToken = token.accessToken();
            tokenExpireTime = now + (token.expiresIn() - 60) * 1000;
            return cachedToken;
        });
    }

    public Mono<List<NewReleaseDto>> getNewReleases() {
        List<NewReleaseDto> cached = newReleasesCache.getIfPresent("KR");
        if (cached != null) return Mono.just(cached);

        return getCachedAccessToken().flatMap(token ->
                webClient.get()
                        .uri("https://api.spotify.com/v1/browse/new-releases?country=KR&limit=10")
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .flatMapMany(json -> {
                            List<Mono<NewReleaseDto>> monoList = new ArrayList<>();
                            for (JsonNode item : json.get("albums").get("items")) {
                                String albumId = item.get("id").asText();
                                String albumName = item.get("name").asText();
                                String artistName = item.get("artists").get(0).get("name").asText();
                                String imageUrl = item.get("images").get(0).get("url").asText();

                                Mono<NewReleaseDto> dtoMono = webClient.get()
                                        .uri("https://api.spotify.com/v1/albums/" + albumId + "/tracks?limit=1")
                                        .headers(headers -> headers.setBearerAuth(token))
                                        .retrieve()
                                        .bodyToMono(JsonNode.class)
                                        .map(trackJson -> {
                                            JsonNode track = trackJson.get("items").get(0);
                                            String trackId = track.get("id").asText();
                                            return new NewReleaseDto(albumName, artistName, imageUrl, trackId);
                                        });

                                monoList.add(dtoMono);
                            }
                            return Flux.fromIterable(monoList)
                                    .flatMap(m -> m, 2)
                                    .delayElements(Duration.ofMillis(100));
                        })
                        .collectList()
                        .doOnNext(result -> newReleasesCache.put("KR", result))
        );
    }

    public Mono<TrackDetailDto> getTrackDetail(String trackId) {
        return getCachedAccessToken().flatMap(token ->
                webClient.get()
                        .uri("https://api.spotify.com/v1/tracks/" + trackId)
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .onStatus(status -> status.value() == 429,
                                response -> Mono.delay(Duration.ofSeconds(1)).then(Mono.error(new RuntimeException("429 Too Many Requests"))))
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

    public Mono<List<SearchResultDto>> search(String query) {
        return getCachedAccessToken().flatMap(token -> {
            Mono<JsonNode> trackResponse = webClient.get()
                    .uri("https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=5")
                    .headers(headers -> headers.setBearerAuth(token))
                    .retrieve()
                    .bodyToMono(JsonNode.class);

            Mono<JsonNode> artistResponse = webClient.get()
                    .uri("https://api.spotify.com/v1/search?q=" + query + "&type=artist&limit=5")
                    .headers(headers -> headers.setBearerAuth(token))
                    .retrieve()
                    .bodyToMono(JsonNode.class);

            return Mono.zip(trackResponse, artistResponse).map(tuple -> {
                List<SearchResultDto> results = new ArrayList<>();
                JsonNode trackJson = tuple.getT1();
                JsonNode artistJson = tuple.getT2();

                if (trackJson.has("tracks")) {
                    for (JsonNode item : trackJson.get("tracks").get("items")) {
                        results.add(new SearchResultDto(
                                item.get("id").asText(),
                                "track",
                                item.get("name").asText(),
                                item.get("artists").get(0).get("name").asText(),
                                item.get("album").get("images").get(0).get("url").asText()
                        ));
                    }
                }

                if (artistJson.has("artists")) {
                    for (JsonNode item : artistJson.get("artists").get("items")) {
                        results.add(new SearchResultDto(
                                item.get("id").asText(),
                                "artist",
                                item.get("name").asText(),
                                "Artist",
                                item.get("images").size() > 0 ? item.get("images").get(0).get("url").asText() : ""
                        ));
                    }
                }

                return results;
            });
        });
    }

    public Mono<ArtistDetailDto> getArtistDetail(String artistId) {
        return getCachedAccessToken().flatMap(token ->
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
        return getCachedAccessToken().flatMap(token ->
                webClient.get()
                        .uri("https://api.spotify.com/v1/search?q=" + query + "&type=track&limit=1")
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .flatMap(json -> {
                            JsonNode items = json.get("tracks").get("items");
                            if (items.isArray() && items.size() > 0) {
                                JsonNode track = items.get(0);
                                return Mono.just(new TrackDetailDto(
                                        track.get("id").asText(),
                                        track.get("name").asText(),
                                        track.get("artists").get(0).get("id").asText(),
                                        track.get("artists").get(0).get("name").asText(),
                                        track.get("album").get("id").asText(),
                                        track.get("album").get("name").asText(),
                                        track.get("album").get("images").get(0).get("url").asText(),
                                        track.has("preview_url") && !track.get("preview_url").isNull()
                                                ? track.get("preview_url").asText() : null
                                ));
                            } else {
                                return Mono.empty();
                            }
                        })
        );
    }

    private record TokenResponse(String accessToken, long expiresIn) {}
}