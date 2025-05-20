package dmusound.dto.user;

import lombok.Data;

@Data
public class UserDto {
    private String userCode;
    private String userId;
    private String userPw;
    private String userName;
    private String googleKey;
    private String kakaoKey;
}