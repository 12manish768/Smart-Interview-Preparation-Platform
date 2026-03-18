package com.interview.platform.controller;

import com.interview.platform.dto.AuthenticationResponse;
import com.interview.platform.dto.LoginRequest;
import com.interview.platform.dto.RegisterRequest;
import com.interview.platform.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        System.out.println("Processing registration request for: " + request.getEmail());
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody LoginRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }
}
