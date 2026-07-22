package org.example.service.impl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.example.entity.User;
import org.example.service.JwtService;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtServiceImpl implements JwtService {
    private final String SECRET_KEY = "nujzyxEaS+d+Xv+2590pyeCZQKofOGCMq2Yzl6QbfA/Vy9WaVY9k9uMLzgOtszsCzoNmSzvo3JPsfCmvW4vDnQ==";

    @Override
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10h
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }
}
