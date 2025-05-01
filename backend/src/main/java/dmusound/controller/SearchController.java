package dmusound.controller;

import dmusound.dto.spotify.SearchResultDto;
import dmusound.service.SpotifyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import reactor.core.publisher.Mono;

import java.util.List;

@Controller
@RequiredArgsConstructor // 생성자 의존성 주입
public class SearchController {

    private final SpotifyService spotifyService;

    @GetMapping("/search") // 검색 요청 처리
    public Mono<String> search(@RequestParam String query, Model model) {
        return spotifyService.search(query) // 검색 결과 조회
                .map(results -> {
                    model.addAttribute("query", query); // 검색어 추가
                    model.addAttribute("results", results); // 검색 결과 추가
                    return "search"; // 뷰 이름 반환
                })
                .onErrorResume(e -> { // 에러 발생 시 처리
                    model.addAttribute("error", "검색 중 문제가 발생했습니다."); // 에러 메시지 추가
                    return Mono.just("errorPage"); // 에러 페이지 반환
                });
    }
}