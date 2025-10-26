package com.aukhtubut.uh2.attendance.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
//@CrossOrigin(origins ="https://api.aukhtubut.com")
@RestController
public class HelloController {

    @GetMapping("/")
    public ResponseEntity<String> hello() {
        final String body = "ATTENDANCE SERVICE UP";
        return ResponseEntity.ok(body);
    }

}
