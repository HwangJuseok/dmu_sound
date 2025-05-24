package dmusound.controller;

import dmusound.dto.login.LoginRequest;
import dmusound.dto.login.LoginResponse;
import dmusound.dto.auth.RegisterRequest;
import dmusound.dto.auth.RegisterResponse;
import dmusound.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * [REST API 전용 인증 컨트롤러]
 * - React, 모바일 앱 등 클라이언트가 JSON으로 로그인/회원가입 요청할 때 사용
 * - 현재는 사용 안 하고, 나중에 필요 시 React 연동 때 사용 예정
 * - 경로: /api/auth/login, /api/auth/register
 */
@RestController
@RequestMapping("/api/auth")
public class ApiAuthController {

    @Autowired
    private AuthService authService;

    // 로그인 API: JSON 요청 (POST)
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // 회원가입 API: JSON 요청 (POST)
    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}

