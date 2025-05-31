package dmusound.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CORS 설정 적용
                .cors(cors -> cors.configurationSource(corsConfigurationSource))

                // CSRF 비활성화 (REST API에서는 일반적으로 비활성화)
                .csrf(csrf -> csrf.disable())

                // 인증 및 인가 설정
                .authorizeHttpRequests(auth -> auth
                        // 인증 없이 접근 가능한 경로들
                        .requestMatchers(
                                "/",                    // 메인 페이지
                                "/auth/**",             // 인증 관련
                                "/css/**",              // 정적 리소스
                                "/js/**",               // 정적 리소스
                                "/images/**",           // 이미지
                                "/favicon.ico",         // 파비콘
                                "/search",              // 검색 페이지
                                "/search/**",           // 검색 관련 페이지
                                "/api/music/**",        // 곡 상세 관련 페이지
                                "/api/search/**",       // 검색 API ✅ 추가
                                "/api/spotify/**",      // Spotify API
                                "/api/youtube/**"       // YouTube API
                        ).permitAll()

                        // 나머지 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )

                // OAuth2 로그인 설정
                .oauth2Login(oauth2 -> oauth2
                        .loginPage("/auth/login")
                        .successHandler(googleLoginSuccessHandler())
                )

                // 로그아웃 설정
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .logoutSuccessUrl("/auth/login")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                );

        return http.build();
    }

    // 로그인 성공 후 이메일을 세션에 저장
    public AuthenticationSuccessHandler googleLoginSuccessHandler() {
        return (HttpServletRequest request, HttpServletResponse response,
                Authentication authentication) -> {

            OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
            String email = oAuth2User.getAttribute("email");

            HttpSession session = request.getSession();
            session.setAttribute("userId", email);

            // 메인 페이지로 리다이렉트
            response.sendRedirect("/");
        };
    }
}