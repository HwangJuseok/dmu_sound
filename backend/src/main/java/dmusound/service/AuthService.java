package dmusound.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dmusound.client.SupabaseClient;
import dmusound.dto.auth.RegisterRequest;
import dmusound.dto.auth.RegisterResponse;
import dmusound.dto.login.LoginRequest;
import dmusound.dto.login.LoginResponse;
import dmusound.dto.user.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class AuthService {

    @Autowired
    private SupabaseClient client;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        try {
            String tableName = "user?user_id=eq." + request.getUserId();
            String responseBody = client.getData(tableName).getBody();

            ObjectMapper mapper = new ObjectMapper();
            JsonNode users = mapper.readTree(responseBody);

            if (users.isEmpty()) {
                return new LoginResponse(false, "존재하지 않는 사용자입니다.", null);
            }

            // ✅ UserDto로 매핑
            UserDto user = mapper.readValue(users.get(0).toString(), UserDto.class);

            if (!passwordEncoder.matches(request.getUserPw(), user.getUserPw())) {
                return new LoginResponse(false, "비밀번호가 일치하지 않습니다.", null);
            }

            String dummyToken = Base64.getEncoder().encodeToString(
                    (request.getUserId() + ":login_success").getBytes(StandardCharsets.UTF_8)
            );

            return new LoginResponse(true, "로그인 성공", dummyToken);

        } catch (Exception e) {
            return new LoginResponse(false, "서버 오류: " + e.getMessage(), null);
        }
    }

    public RegisterResponse register(RegisterRequest request) {
        try {
            String checkUrl = "user?user_id=eq." + request.getUserId();
            String existing = client.getData(checkUrl).getBody();
            ObjectMapper mapper = new ObjectMapper();
            if (mapper.readTree(existing).size() > 0) {
                return new RegisterResponse(false, "이미 존재하는 아이디입니다.");
            }

            String hashedPw = passwordEncoder.encode(request.getUserPw());

            String insertJson = String.format(
                    "{\"user_id\":\"%s\",\"user_pw\":\"%s\",\"user_name\":\"%s\"}",
                    request.getUserId(), hashedPw, request.getUserName()
            );

            client.insertData("user", insertJson);

            return new RegisterResponse(true, "회원가입 성공");

        } catch (Exception e) {
            return new RegisterResponse(false, "서버 오류: " + e.getMessage());
        }
    }
}
