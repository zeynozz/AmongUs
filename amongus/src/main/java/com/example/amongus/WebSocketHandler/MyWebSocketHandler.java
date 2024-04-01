package com.example.amongus.WebSocketHandler;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class MyWebSocketHandler extends TextWebSocketHandler {
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Received message: " + message.getPayload());
        String echoMessage = "{\"type\":\"echo\", \"payload\":" + message.getPayload() + "}";
        session.sendMessage(new TextMessage(echoMessage));
    }

}
