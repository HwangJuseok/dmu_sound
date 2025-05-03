package dmusound.controller;

import dmusound.service.SupabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/supabase")
public class SupabaseController {

    @Autowired
    private SupabaseService service;

    @GetMapping("/acr")
    public String getAcr() {
        return service.fetchAcr(); // acr 테이블 데이터 가져오기
    }
}
