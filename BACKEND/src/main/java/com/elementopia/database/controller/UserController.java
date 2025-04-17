package com.elementopia.database.controller;

import com.elementopia.database.dto.JwtResponse;
import com.elementopia.database.dto.LoginRequest;
import com.elementopia.database.dto.LoginResponse;
import com.elementopia.database.dto.UserDTO;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.service.UserService;
import com.elementopia.database.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService uServ;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    // Create User (returns DTO)
    @PostMapping("/createUser")
    public ResponseEntity<UserDTO> createUser(@RequestBody UserEntity user) {
        // Hash password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        UserEntity createdUser = uServ.createUser(user);
        return ResponseEntity.ok(uServ.toDTO(createdUser));
    }

    // Get All Users (returns list of DTOs)
    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = uServ.getAllUsers()
                .stream()
                .map(uServ::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Get User By ID (returns DTO)
    @GetMapping("/getUser/{id}")
    public ResponseEntity<?> getUser(@PathVariable Long id) {
        UserEntity user = uServ.getUser(id);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.ok(uServ.toDTO(user));
    }

    // Update User By ID (returns updated DTO)
    @PutMapping("/updateUser")
    public ResponseEntity<UserDTO> updateUser(@RequestParam Long id, @RequestBody UserEntity newUserDetails) {
        if (newUserDetails.getPassword() != null) {
            newUserDetails.setPassword(passwordEncoder.encode(newUserDetails.getPassword()));
        }
        UserEntity updatedUser = uServ.updateUser(id, newUserDetails);
        return ResponseEntity.ok(uServ.toDTO(updatedUser));
    }

    // Update Profile By ID (returns updated DTO)
    @PutMapping("/updateProfile")
    public ResponseEntity<UserDTO> updateProfile(@RequestParam Long id, @RequestBody UserEntity newUserDetails) {
        UserEntity updatedUser = uServ.updateProfile(id, newUserDetails);
        return ResponseEntity.ok(uServ.toDTO(updatedUser));
    }

    // Delete User By ID
    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        String result = uServ.deleteUser(id);
        return ResponseEntity.ok(result);
    }

    // Register User (JWT-compatible; returns DTO)
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserEntity user) {
        try {
            UserEntity newUser = uServ.registerUser(user);
            return ResponseEntity.ok(uServ.toDTO(newUser));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Login User (JWT)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.username(),
                            loginRequest.password()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            // Return token and message only (no user DTO)
            return ResponseEntity.ok(
                    new LoginResponse("Login successful!", jwt)
            );
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password!");
        }
    }


    // Get Current User (JWT-based; returns DTO)
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session found!");
        }
        UserEntity user = uServ.findByUsername(authentication.getName());
        return ResponseEntity.ok(uServ.toDTO(user));
    }
}
