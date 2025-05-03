package dmusound.client;

import dmusound.config.SupabaseConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SupabaseClient {

    @Autowired
    private SupabaseConfig config;

    private final RestTemplate restTemplate = new RestTemplate();

    public ResponseEntity<String> getData(String tableName) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", config.apiKey);
        headers.set("Authorization", "Bearer " + config.apiKey);
        headers.set("Accept", "application/json");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(
                config.baseUrl + "/" + tableName,
                HttpMethod.GET,
                entity,
                String.class
        );
    }
}
