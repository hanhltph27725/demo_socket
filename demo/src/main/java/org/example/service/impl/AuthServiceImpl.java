package org.example.service.impl;

import org.example.entity.User;
import org.example.model.request.LoginRequest;
import org.example.model.request.RegisterRequest;
import org.example.model.response.AuthResponse;
import org.example.repository.UserRepository;
import org.example.service.AuthService;
import org.example.service.JwtService;
import org.example.utils.RedisKeyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
public class AuthServiceImpl implements AuthService {
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final long BLOCK_TIME_MINUTES = 10;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private StringRedisTemplate redisTemplate;

    @Override
    public AuthResponse register(RegisterRequest request) {
        var user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepo.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getUsername());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier();
        String key = RedisKeyUtil.loginAttempts(identifier);

        String attemptsStr = redisTemplate.opsForValue().get(key);
        int attempts = attemptsStr != null ? Integer.parseInt(attemptsStr) : 0;

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            throw new RuntimeException("Too many failed attempts. Try again in 10 minutes.");
        }

        Optional<User> optionalUser = userRepo.findByUsername(identifier);
        if (optionalUser.isEmpty()) {
            optionalUser = userRepo.findByEmail(identifier);
        }

        if (optionalUser.isEmpty()) {
            increaseAttempts(key);
            throw new RuntimeException("User not found");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            increaseAttempts(key);
            throw new RuntimeException("Invalid password");
        }

        redisTemplate.delete(key);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, user.getUsername());
    }

    private void increaseAttempts(String key) {
        Long current = redisTemplate.opsForValue().increment(key);
        if (current != null && current == 1) {
            redisTemplate.expire(key, BLOCK_TIME_MINUTES, TimeUnit.MINUTES);
        }
    }
}
