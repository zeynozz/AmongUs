package com.example.amongus.controller;

import com.example.amongus.model.ChatMessage;
import com.example.amongus.model.Player;
import com.example.amongus.model.Position;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class GameController {

    private final Map<String, Player> players = new HashMap<>();

    @MessageMapping("/setName")
    @SendTo("/topic/users")
    public synchronized Map<String, Player> setName(Player player) {
        players.put(player.getId(), player);
        return players; // Sendet den Zustand aller Spieler zurück
    }

    @MessageMapping("/move")
    @SendTo("/topic/positions")
    public synchronized Map<String, Position> move(Player player) {
        if (players.containsKey(player.getId())) {
            players.get(player.getId()).setPosition(player.getPosition());
        }
        Map<String, Position> positions = new HashMap<>();
        players.forEach((id, pl) -> positions.put(id, pl.getPosition()));
        return positions; // Sendet die Positionen aller Spieler zurück
    }

    @MessageMapping("/app/chat.sendMessage")
    @SendTo("/topic/messages")
    public ChatMessage send(ChatMessage message) {
        return message;
    }
}
