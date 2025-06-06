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

    // ✅ 괄호 제거 전처리 함수 (제목, 아티스트 모두 사용)
    private String cleanText(String text) {
        if (text == null) return "";
        return text.replaceAll("\\s*\\(.*?\\)", "").trim();
    }

    public List<TitleArtistPair> getAcrTitlesAndArtistsByUserCode(String userCode) {
        try {
            String url = "acr?user_code=eq." + userCode;
            String response = client.getData(url).getBody();
            JsonNode root = mapper.readTree(response);

            List<TitleArtistPair> result = new ArrayList<>();

            for (JsonNode node : root) {
                String rawTitle = node.get("acr_title").asText();
                String rawArtist = node.get("artists").asText();

                // ✅ 전처리 적용
                String cleanedTitle = cleanText(rawTitle);
                String cleanedArtist = cleanText(rawArtist);

                result.add(new TitleArtistPair(cleanedTitle, cleanedArtist));
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
