/**
 * 🔒 [Deprecated / Backup Only]
 *
 * 이 컨트롤러는 ApiAuthController.java로 기능이 이전되어 현재는 사용되지 않습니다.
 *
 * - 역할: JSON 기반 로그인/회원가입 API 제공 (기존 REST 컨트롤러)
 * - 현재는 /api/auth 경로로 통합됨
 * - 필요 시 참고용으로만 남겨둡니다. 추후 삭제 예정
 *


package dmusound.controller;

import dmusound.dto.auth.RegisterRequest;
import dmusound.dto.auth.RegisterResponse;
import dmusound.dto.login.LoginRequest;
import dmusound.dto.login.LoginResponse;
import dmusound.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/auth")
public class AuthControllerbak {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }
}
*/