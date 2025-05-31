package dmusound.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dmusound.client.SupabaseClient;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AcrService {

    private final SupabaseClient client;
    private final ObjectMapper mapper;

    public List<TitleArtistPair> getAcrTitlesAndArtistsByUserCode(String userCode) {
        try {
            String url = "acr?user_code=eq." + userCode;
            String response = client.getData(url).getBody();
            JsonNode root = mapper.readTree(response);

            List<TitleArtistPair> result = new ArrayList<>();

            for (JsonNode node : root) {
                String title = node.get("acr_title").asText();
                String artist = node.get("artists").asText();
                result.add(new TitleArtistPair(title, artist));
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("ACR 정보 불러오기 실패: " + e.getMessage());
        }
    }

    @Getter
    @AllArgsConstructor
    public static class TitleArtistPair {
        private String title;
        private String artist;
    }
}
