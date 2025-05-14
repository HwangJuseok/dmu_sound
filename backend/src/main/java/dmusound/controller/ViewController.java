package dmusound.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/login")
    public String loginPage() {
        return "login"; // resources/templates/login.mustache 렌더링
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register"; // resources/templates/register.mustache 렌더링
    }
}
