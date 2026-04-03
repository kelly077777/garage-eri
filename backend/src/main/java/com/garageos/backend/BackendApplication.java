package com.garageos.backend;

import com.garageos.backend.model.User;
import com.garageos.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public BackendApplication(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User manager = new User();
            manager.setName("Admin Manager");
            manager.setEmail("admin@garageos.com");
            manager.setPassword(passwordEncoder.encode("admin123"));
            manager.setRole(User.Role.manager);
            userRepository.save(manager);
            System.out.println("✅ Default manager created: admin@garageos.com / admin123");
        }
    }
}