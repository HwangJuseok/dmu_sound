package dmusound.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import dmusound.dto.spotify.NewReleaseDto;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.List;

@Configuration
public class CacheConfig {
    @Bean
    public Cache<String, List<NewReleaseDto>> newReleasesCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(Duration.ofMinutes(10))
                .maximumSize(100)
                .build();
    }
}
