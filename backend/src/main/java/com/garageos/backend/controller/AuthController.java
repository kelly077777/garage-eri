package com.garageos.backend.controller;

import com.garageos.backend.config.JwtUtil;
import com.garageos.backend.model.User;
import com.garageos.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map; 

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return userRepo.findByEmail(body.get("email"))
            .filter(u -> passwordEncoder.matches(body.get("password"), u.getPassword()))
            .map(u -> ResponseEntity.ok(Map.of(
                "token", jwtUtil.generateToken(u.getEmail(), u.getRole().name()),
                "user", Map.of(
                    "id", u.getId(),
                    "name", u.getName(),
                    "email", u.getEmail(),
                    "role", u.getRole()
                )
            )))
            .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return ResponseEntity.ok(userRepo.save(user));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepo.findAll()
            .stream()
            .map(u -> Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "role", u.getRole()
            ))
            .toList());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
        return ResponseEntity.ok().build();
    } 

    @PutMapping("/users/{id}")
public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, String> payload) {
    return userRepo.findById(id).map(user -> {
        if (payload.containsKey("name")) user.setName(payload.get("name"));
        if (payload.containsKey("email")) user.setEmail(payload.get("email"));
       if (payload.containsKey("role")) user.setRole(User.Role.valueOf(payload.get("role").toLowerCase()));
        if (payload.containsKey("password") && payload.get("password") != null && !payload.get("password").isEmpty()) {
            user.setPassword(passwordEncoder.encode(payload.get("password")));
        }
        return ResponseEntity.ok(userRepo.save(user));
    }).orElse(ResponseEntity.notFound().build());
}

}