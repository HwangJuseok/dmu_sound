package dmusound.controller;

import dmusound.dto.auth.RegisterRequest;
import dmusound.dto.auth.RegisterResponse;
import dmusound.dto.login.LoginRequest;
import dmusound.dto.login.LoginResponse;
import dmusound.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

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
        LoginResponse response = authService.login(request);
        if (!response.isSuccess()) {
            model.addAttribute("error", response.getMessage());
            return "login";
        }

        // ✅ 1. 세션에 유저 ID 저장
        session.setAttribute("userId", request.getUserId());

        // ✅ 2. Security 인증 객체 생성
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(request.getUserId(), null, Collections.emptyList());

        // ✅ 3. SecurityContext 생성 + 설정
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        securityContext.setAuthentication(authentication);

        // ✅ 4. 세션에 SecurityContext 저장
        session.setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                securityContext
        );

        // ✅ 5. 현재 요청에서도 SecurityContextHolder로 설정 (1회용)
        SecurityContextHolder.setContext(securityContext);

        return "redirect:/"; // 또는 원래 페이지로
    }


    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/auth/login";
    }
}
