package com.garageos.backend;

import com.garageos.backend.model.User;
import com.garageos.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
public class BackendApplication implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User manager = User.builder()
                .name("Admin Manager")
                .email("admin@garageos.com")
                .password(passwordEncoder.encode("admin123"))
                .role(User.Role.manager)
                .build();
            userRepository.save(manager);
            System.out.println("✅ Default manager created: admin@garageos.com / admin123");
        }
    }
}