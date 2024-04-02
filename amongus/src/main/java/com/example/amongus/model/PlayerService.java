package com.example.amongus.model;

import org.springframework.stereotype.Service;



import java.util.HashSet;
import java.util.Set;


@Service
public class PlayerService {
    private Set<String> usernames = new HashSet<>();

    public boolean addPlayer(String username) {
        if (usernames.contains(username)) {
            return false;
        }
        usernames.add(username);
        return true;
    }
}



