package org.example.service;

import org.example.model.request.LoginRequest;
import org.example.model.response.AuthResponse;
import org.example.model.request.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
