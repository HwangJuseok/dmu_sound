package dmusound.controller;

import dmusound.dto.auth.RegisterRequest;
import dmusound.dto.auth.RegisterResponse;
import dmusound.dto.login.LoginRequest;
import dmusound.dto.login.LoginResponse;
import dmusound.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class FormAuthController {

    @Autowired
    private AuthService authService;

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute RegisterRequest request, Model model) {
        RegisterResponse response = authService.register(request);
        model.addAttribute("message", response.getMessage());
        model.addAttribute("success", response.isSuccess());
        return "registerResult"; // 회원가입 결과 뷰
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login";
    }

    @PostMapping("/login/process")
    public String login(@ModelAttribute LoginRequest request, HttpSession session, Model model) {
        System.out.println("✅ 로그인 컨트롤러 진입");
        LoginResponse response = authService.login(request);
        if (!response.isSuccess()) {
            model.addAttribute("error", response.getMessage());
            return "login";
        }
        session.setAttribute("userId", request.getUserId());
        return "redirect:/";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/auth/login";
    }
}
