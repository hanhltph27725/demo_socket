package org.example.utils;

public class RedisKeyUtil {
    private static final String LOGIN_ATTEMPT_PREFIX = "login_attempts:";

    public static String loginAttempts(String usernameOrEmail) {
        return LOGIN_ATTEMPT_PREFIX + usernameOrEmail;
    }
}
