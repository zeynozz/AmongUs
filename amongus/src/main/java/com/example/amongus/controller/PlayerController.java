package com.example.amongus.controller;

import com.example.amongus.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;


import java.util.Map;


@RestController
public class PlayerController {
    @Autowired
    private PlayerService playerService;

    @PostMapping("/addPlayer")
    public ResponseEntity<?> addPlayer(@RequestBody Map<String, String> body) {
        String username = body.get("name");
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest().body("Benutzername fehlt oder ist leer.");
        }

        boolean added = playerService.addPlayer(username);
        if (added) {
            return ResponseEntity.ok().body(Map.of("success", true));
        } else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Dieser Benutzername wird bereits verwendet. Bitte wählen Sie einen anderen."));
        }
    }
}



