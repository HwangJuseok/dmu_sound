package dmusound.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@ConfigurationProperties(prefix = "spotify")
@Data
public class SpotifyProperties {
    private List<Client> clients;

    @Data
    public static class Client {
        private String id;
        private String secret;
    }
}
