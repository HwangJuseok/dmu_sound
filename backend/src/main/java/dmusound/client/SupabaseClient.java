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

    public ResponseEntity<String> insertData(String tableName, String jsonData) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", config.apiKey);
        headers.set("Authorization", "Bearer " + config.apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(jsonData, headers);

        return restTemplate.exchange(
                config.baseUrl + "/" + tableName,
                HttpMethod.POST,
                entity,
                String.class
        );
    }

    public void deleteData(String path) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", config.apiKey);
        headers.set("Authorization", "Bearer " + config.apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        restTemplate.exchange(
                config.baseUrl + "/" + path,
                HttpMethod.DELETE,
                entity,
                Void.class
        );
    }

}
