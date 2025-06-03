package dmusound.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserDto {

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("user_pw")
    private String userPw;

    @JsonProperty("user_name")
    private String userName;

    @JsonProperty("google_key")
    private String googleKey;

    @JsonProperty("kakao_key")
    private String kakaoKey;

    @JsonProperty("user_code")
    private int userCode;
}
