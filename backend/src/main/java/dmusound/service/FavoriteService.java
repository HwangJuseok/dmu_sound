package dmusound.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dmusound.client.SupabaseClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final SupabaseClient supabaseClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isFavorited(int userCode, String trackId) {
        String path = String.format("favorite?user_code=eq.%d&spotify_id=eq.%s", userCode, trackId);
        String body = supabaseClient.getData(path).getBody();
        try {
            return objectMapper.readTree(body).size() > 0;
        } catch (Exception e) {
            return false;
        }
    }

    public void addFavorite(int userCode, String trackId) {
        String json = String.format("{\"user_code\": %d, \"spotify_id\": \"%s\"}", userCode, trackId);
        supabaseClient.insertData("favorite", json);
    }

    public void removeFavorite(int userCode, String trackId) {
        String path = String.format("favorite?user_code=eq.%d&spotify_id=eq.%s", userCode, trackId);
        supabaseClient.deleteData(path);
    }
}
