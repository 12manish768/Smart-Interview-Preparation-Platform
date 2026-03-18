package com.interview.platform;

import com.interview.platform.model.User;
import com.interview.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SmartInterviewPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartInterviewPlatformApplication.class, args);
    }

    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByEmail("shiva@gmail.com").isEmpty()) {
                User user = User.builder()
                        .username("Shiva Ss")
                        .email("shiva@gmail.com")
                        .password(passwordEncoder.encode("shiva"))
                        .role(User.Role.CANDIDATE)
                        .build();
                userRepository.save(user);
                System.out.println("Default user created: shiva@gmail.com / shiva");
            }
        };
    }
}
