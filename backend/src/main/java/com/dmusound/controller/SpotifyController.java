package com.dmusound.controller;

import com.dmusound.service.SpotifyTokenService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api")
public class SpotifyController {

    private final RestTemplate restTemplate;
    private final SpotifyTokenService spotifyTokenService;

    public SpotifyController(RestTemplate restTemplate, SpotifyTokenService spotifyTokenService) {
        this.restTemplate = restTemplate;
        this.spotifyTokenService = spotifyTokenService;
    }

    @GetMapping("/tracks")
    public ResponseEntity<?> getTracks(@RequestParam String query) {
    System.out.println("Received API request with query: " + query);
    
    String accessToken = "Bearer " + spotifyTokenService.getAccessToken();
    String url = "https://api.spotify.com/v1/search?q=" + query + "&type=track";
    System.out.println("Using access token: " + accessToken);

    HttpHeaders headers = new HttpHeaders();
    headers.set("Authorization", accessToken);

    HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

    try {
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);
        System.out.println("Spotify API response: " + response.getBody());
        return ResponseEntity.ok(response.getBody());
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
    }
}


}
