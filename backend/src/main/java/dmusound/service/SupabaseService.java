package dmusound.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dmusound.client.SupabaseClient;
import dmusound.dto.spotify.TrackDetailDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SupabaseService {

    @Autowired
    private SupabaseClient client;

    @Autowired
    private ObjectMapper objectMapper; // ✅ ObjectMapper를 Spring Bean으로 주입

    /**
     * Supabase의 spotify 테이블에 트랙 정보를 저장합니다.
     * 중복된 track_id일 경우 자동 병합됩니다.
     */
    public void saveTrackDetail(TrackDetailDto dto) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("track_id", dto.getId());
            payload.put("track_name", dto.getTrackName());
            payload.put("artist_id", dto.getArtistId());
            payload.put("artist_name", dto.getArtistName());
            payload.put("album_id", dto.getAlbumId());
            payload.put("album_name", dto.getAlbumName());
            payload.put("image_url", dto.getImageUrl());
            payload.put("preview_url", dto.getPreviewUrl());

            // JSON 직렬화 후 Supabase에 전송
            String json = objectMapper.writeValueAsString(payload);
            client.insertData("spotify", json);

            System.out.println("✅ Supabase에 트랙 저장 완료: " + dto.getTrackName());

        } catch (Exception e) {
            System.err.println("❌ Supabase 저장 오류: " + e.getMessage());
        }
    }

    /**
     * 테스트용: Supabase에서 "acr" 테이블 데이터 조회
     */
    public String fetchAcr() {
        return client.getData("acr").getBody();
    }
}
