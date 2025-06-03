package dmusound.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RedirectController {

    @GetMapping("/")
    public String redirectToFrontend() {
        return "redirect:http://localhost:3000"; // 🔁 리액트 주소로 리디렉트
    }
}
