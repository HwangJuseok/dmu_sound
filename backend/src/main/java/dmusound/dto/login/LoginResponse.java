package dmusound.dto.login;

public class LoginResponse {
    private boolean success;
    private String message;
    private String token;
    private String usercode;

    public LoginResponse() {}

    public LoginResponse(boolean success, String message, String token, String usercode) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.usercode = usercode;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsercode() {
        return usercode;
    }

    public void setUsercode(String usercode) {
        this.usercode = usercode;
    }
    
}
