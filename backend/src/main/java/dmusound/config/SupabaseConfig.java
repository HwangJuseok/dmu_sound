package dmusound.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SupabaseConfig {
    @Value("${supabase.url}")
    public String baseUrl;

    @Value("${supabase.key}")
    public String apiKey;
}
