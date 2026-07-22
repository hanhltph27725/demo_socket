package org.example.service;

import org.example.entity.Product;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface SseService {

    SseEmitter subscribe();

    void broadcast(List<Product> products);
}
