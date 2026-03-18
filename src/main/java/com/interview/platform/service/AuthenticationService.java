package com.interview.platform.service;

import com.interview.platform.dto.AuthenticationResponse;
import com.interview.platform.dto.LoginRequest;
import com.interview.platform.dto.RegisterRequest;
import com.interview.platform.model.User;
import com.interview.platform.repository.UserRepository;
import com.interview.platform.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.CANDIDATE)
                .build();
        repository.save(user);

        var springUser = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        var jwtToken = jwtService.generateToken(springUser);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public AuthenticationResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var springUser = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        var jwtToken = jwtService.generateToken(springUser);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
