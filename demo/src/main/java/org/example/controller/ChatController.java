package org.example.controller;

import org.example.model.ChatMessage;
import org.example.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        return chatService.subscribe();
    }

    @GetMapping("/history")
    public List<ChatMessage> history() {
        return chatService.history();
    }

    @PostMapping("/send")
    public void send(@RequestBody ChatMessage message) {
        message.setTimestamp(System.currentTimeMillis());
        chatService.send(message);
    }
}
