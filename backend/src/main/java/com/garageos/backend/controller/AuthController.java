package com.garageos.backend.controller;

import com.garageos.backend.config.JwtUtil;
import com.garageos.backend.model.User;
import com.garageos.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "https://inquisitive-kataifi-41bdfe.netlify.app"})
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    private Map<String, Object> userToMap(User u) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", u.getId());
        map.put("name", u.getName());
        map.put("email", u.getEmail());
        map.put("role", u.getRole());
        map.put("permissions", u.getPermissions() != null ? u.getPermissions() : "");
        return map;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        return userRepo.findByEmail(body.get("email"))
            .filter(u -> passwordEncoder.matches(body.get("password"), u.getPassword()))
            .map(u -> {
                Map<String, Object> response = new HashMap<>();
                response.put("token", jwtUtil.generateToken(u.getEmail(), u.getRole().name()));
                response.put("user", userToMap(u));
                return ResponseEntity.ok(response);
            })
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
            .stream().map(this::userToMap).toList());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtil.extractEmail(token);
            return userRepo.findByEmail(email)
                .map(u -> ResponseEntity.ok(userToMap(u)))
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
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
            if (payload.containsKey("permissions")) user.setPermissions(payload.get("permissions"));
            return ResponseEntity.ok(userToMap(user.equals(userRepo.save(user)) ? user : userRepo.save(user)));
        }).orElse(ResponseEntity.notFound().build());
    }
}