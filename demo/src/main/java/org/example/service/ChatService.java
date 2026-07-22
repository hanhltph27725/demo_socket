package org.example.service;

import org.example.model.ChatMessage;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface ChatService {

    SseEmitter subscribe();

    void send(ChatMessage message);

    List<ChatMessage> history();
}
