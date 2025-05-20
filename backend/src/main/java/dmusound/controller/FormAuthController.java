package dmusound.controller;

import dmusound.dto.auth.RegisterRequest;
import dmusound.dto.auth.RegisterResponse;
import dmusound.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/form")
public class FormAuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public String register(@ModelAttribute RegisterRequest request, Model model) {
        RegisterResponse response = authService.register(request);
        model.addAttribute("message", response.getMessage());
        model.addAttribute("success", response.isSuccess());
        return "registerResult"; // 성공 결과 보여줄 Mustache 페이지
    }
}