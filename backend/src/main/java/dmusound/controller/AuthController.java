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
public class AuthController {

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
