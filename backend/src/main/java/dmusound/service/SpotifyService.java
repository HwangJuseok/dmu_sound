package dmusound.service;

import dmusound.dto.spotify.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.util.LinkedMultiValueMap;
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
        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "client_credentials");

        return webClient.post()
                .uri("https://accounts.spotify.com/api/token")
                .headers(headers -> headers.setBasicAuth(clientId, clientSecret))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters.fromFormData(formData))
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

    public Mono<List<SearchResultDto>> search(String query) {
        return getAccessToken().flatMap(token ->
                webClient.get()
                        .uri(uriBuilder -> uriBuilder
                                .scheme("https")
                                .host("api.spotify.com")
                                .path("/v1/search")
                                .queryParam("q", query)
                                .queryParam("type", "track,artist")
                                .queryParam("limit", 10)
                                .build())
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .map(json -> {
                            List<SearchResultDto> resultList = new ArrayList<>();

                            JsonNode tracks = json.path("tracks").path("items");
                            for (JsonNode track : tracks) {
                                resultList.add(new SearchResultDto(
                                        track.get("id").asText(),
                                        "track",
                                        track.get("name").asText(),
                                        track.get("artists").get(0).get("name").asText(),
                                        track.get("album").get("images").get(0).get("url").asText()
                                ));
                            }

                            JsonNode artists = json.path("artists").path("items");
                            for (JsonNode artist : artists) {
                                resultList.add(new SearchResultDto(
                                        artist.get("id").asText(),
                                        "artist",
                                        artist.get("name").asText(),
                                        "", // 아티스트는 부가 정보 없음
                                        artist.get("images").isEmpty() ? "" : artist.get("images").get(0).get("url").asText()
                                ));
                            }

                            return resultList;
                        })
        );
    }

    public Mono<TrackDetailDto> getTrackDetail(String trackId) {
        return getAccessToken().flatMap(token ->
                webClient.get()
                        .uri("https://api.spotify.com/v1/tracks/" + trackId)
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .map((JsonNode json) -> {
                            TrackDetailDto dto = new TrackDetailDto();
                            dto.setId(json.get("id").asText());
                            dto.setTrackName(json.get("name").asText());
                            dto.setArtistId(json.get("artists").get(0).get("id").asText());
                            dto.setArtistName(json.get("artists").get(0).get("name").asText());
                            dto.setAlbumId(json.get("album").get("id").asText());
                            dto.setAlbumName(json.get("album").get("name").asText());
                            dto.setImageUrl(json.get("album").get("images").get(0).get("url").asText());
                            dto.setPreviewUrl(json.get("preview_url").asText());
                            return dto;
                        })

        );
    }

    public Mono<ArtistDetailDto> getArtistDetail(String artistId) {
        return getAccessToken().flatMap(token ->
                // 아티스트 기본 정보 호출
                webClient.get()
                        .uri("https://api.spotify.com/v1/artists/" + artistId)
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .flatMap(artistJson -> {
                            // 아티스트의 Top Tracks도 함께 요청
                            return webClient.get()
                                    .uri("https://api.spotify.com/v1/artists/" + artistId + "/top-tracks?market=KR")
                                    .headers(headers -> headers.setBearerAuth(token))
                                    .retrieve()
                                    .bodyToMono(JsonNode.class)
                                    .map(topTracksJson -> {
                                        List<TrackDetailDto> topTracks = new ArrayList<>();
                                        for (JsonNode track : topTracksJson.get("tracks")) {
                                            TrackDetailDto trackDto = new TrackDetailDto();
                                            trackDto.setId(track.get("id").asText());
                                            trackDto.setTrackName(track.get("name").asText());
                                            trackDto.setArtistId(artistId);
                                            trackDto.setArtistName(artistJson.get("name").asText());
                                            trackDto.setAlbumId(track.get("album").get("id").asText());
                                            trackDto.setAlbumName(track.get("album").get("name").asText());
                                            trackDto.setImageUrl(track.get("album").get("images").get(0).get("url").asText());
                                            trackDto.setPreviewUrl(track.get("preview_url").asText(null));
                                            topTracks.add(trackDto);
                                        }

                                        // 최종 ArtistDetailDto 구성
                                        ArtistDetailDto dto = new ArtistDetailDto();
                                        dto.setId(artistJson.get("id").asText());
                                        dto.setName(artistJson.get("name").asText());
                                        dto.setImageUrl(
                                                artistJson.has("images") && artistJson.get("images").size() > 0
                                                        ? artistJson.get("images").get(0).get("url").asText()
                                                        : ""
                                        );
                                        dto.setTopTracks(topTracks);
                                        return dto;
                                    });
                        })
        );
    }

    public Mono<AlbumDetailDto> getAlbumDetail(String albumId) {
        return getAccessToken().flatMap(token ->
                // 앨범 기본 정보 조회
                webClient.get()
                        .uri("https://api.spotify.com/v1/albums/" + albumId)
                        .headers(headers -> headers.setBearerAuth(token))
                        .retrieve()
                        .bodyToMono(JsonNode.class)
                        .map(albumJson -> {
                            List<TrackDetailDto> trackList = new ArrayList<>();
                            for (JsonNode track : albumJson.get("tracks").get("items")) {
                                TrackDetailDto trackDto = new TrackDetailDto();
                                trackDto.setId(track.get("id").asText());
                                trackDto.setTrackName(track.get("name").asText());
                                trackDto.setArtistId(albumJson.get("artists").get(0).get("id").asText());
                                trackDto.setArtistName(albumJson.get("artists").get(0).get("name").asText());
                                trackDto.setAlbumId(albumJson.get("id").asText());
                                trackDto.setAlbumName(albumJson.get("name").asText());
                                trackDto.setImageUrl(albumJson.get("images").get(0).get("url").asText());
                                trackDto.setPreviewUrl(track.get("preview_url").asText(null));
                                trackList.add(trackDto);
                            }

                            return new AlbumDetailDto(
                                    albumJson.get("id").asText(),
                                    albumJson.get("name").asText(),
                                    albumJson.get("artists").get(0).get("id").asText(),
                                    albumJson.get("artists").get(0).get("name").asText(),
                                    albumJson.get("images").get(0).get("url").asText(),
                                    trackList
                            );
                        })
        );
    }





}
