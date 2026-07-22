package org.example.service;

import org.example.entity.User;

public interface JwtService {
    String generateToken(User user);
}
