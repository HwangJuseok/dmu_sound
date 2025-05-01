package dmusound.controller;

import dmusound.dto.spotify.SearchResultDto;
import dmusound.service.SpotifyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class SearchController {

    private final SpotifyService spotifyService;

    @GetMapping("/search")
    public String search(@RequestParam String query, Model model) {
        List<SearchResultDto> results = spotifyService.search(query).block(); // 동기 처리
        model.addAttribute("query", query);
        model.addAttribute("results", results);
        return "search";
    }
}
