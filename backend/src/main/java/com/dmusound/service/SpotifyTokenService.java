package com.dmusound.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;

@Service
public class SpotifyTokenService {

    @Value("${spotify.client.id}")
    private String clientId;

    @Value("${spotify.client.secret}")
    private String clientSecret;

    private String accessToken;
    private Instant tokenExpiryTime;

    private final RestTemplate restTemplate;

    public SpotifyTokenService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getAccessToken() {
        if (accessToken == null || Instant.now().isAfter(tokenExpiryTime)) {
            refreshAccessToken();
        }
        return accessToken;
    }

    private void refreshAccessToken() {
        String tokenUrl = "https://accounts.spotify.com/api/token";
    
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(clientId, clientSecret); // 클라이언트 ID와 시크릿 확인
        headers.set("Content-Type", "application/x-www-form-urlencoded");
    
        String body = "grant_type=client_credentials";
    
        HttpEntity<String> request = new HttpEntity<>(body, headers);
    
        try {
            // 요청 로그
            System.out.println("Request URL: " + tokenUrl);
            System.out.println("Request Headers: " + headers);
            System.out.println("Request Body: " + body);
    
            // API 요청 및 응답 확인
            ResponseEntity<SpotifyTokenResponse> response = restTemplate.exchange(
                    tokenUrl,
                    HttpMethod.POST,
                    request,
                    SpotifyTokenResponse.class
            );
    
            SpotifyTokenResponse tokenResponse = response.getBody();
            if (tokenResponse != null) {
                this.accessToken = tokenResponse.getAccessToken();
                this.tokenExpiryTime = Instant.now().plusSeconds(tokenResponse.getExpiresIn());
    
                // 성공 로그
                System.out.println("Token successfully refreshed!");
                System.out.println("Access Token: " + this.accessToken);
                System.out.println("Expires In: " + tokenResponse.getExpiresIn() + " seconds");
            } else {
                System.out.println("No response body received from Spotify API.");
            }
        } catch (Exception e) {
            // 예외 처리 로그
            System.err.println("Failed to refresh access token.");
            e.printStackTrace();
        }
    }
    

    private static class SpotifyTokenResponse {
        private String access_token;
        private int expires_in;

        public String getAccessToken() {
            return access_token;
        }

        public int getExpiresIn() {
            return expires_in;
        }
    }
}
