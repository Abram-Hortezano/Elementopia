package com.elementopia.database.controller;

import com.elementopia.database.dto.*;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.service.UserService;
<<<<<<< HEAD
<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
=======
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
=======
import com.elementopia.database.util.JwtUtil;
>>>>>>> f091a6cbcbbccfa51b1caa9eb87dc9e91edbfd74
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
>>>>>>> c86b59f5a44db58bcd910fc19b0c61ceb1cdb006
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
<<<<<<< HEAD
@RequestMapping("/api/user") // Removed unnecessary method type
=======
@RequestMapping("/api/user")
>>>>>>> c86b59f5a44db58bcd910fc19b0c61ceb1cdb006
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
    @GetMapping("/getAllUserScore")
    public ResponseEntity<List<UserSummaryDto>> getAllStudentsWithCareerScores() {
        List<UserSummaryDto> students = uServ.getAllStudentsWithCareerScores();
        return ResponseEntity.ok(students);
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
<<<<<<< HEAD
                            loginRequest.getUsername(), loginRequest.getPassword()));
<<<<<<< HEAD

            SecurityContextHolder.getContext().setAuthentication(authentication);

            return ResponseEntity.ok("Login successful, session created!");
=======
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return ResponseEntity.ok("Login successful!");
>>>>>>> c86b59f5a44db58bcd910fc19b0c61ceb1cdb006
=======
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
>>>>>>> f091a6cbcbbccfa51b1caa9eb87dc9e91edbfd74
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password!");
        }
    }

<<<<<<< HEAD
    // Logout User
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser() {
=======

<<<<<<< HEAD
    // Logout User
    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false); // Get session if exists, don't create a new one
        if (session != null) {
            session.invalidate();
        }

>>>>>>> c86b59f5a44db58bcd910fc19b0c61ceb1cdb006
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok("Logged out successfully!");
    }

    // Get Current Logged-in User
    @GetMapping("/current-user")
<<<<<<< HEAD
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        if (principal == null) {
=======
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request, Principal principal) {
        HttpSession session = request.getSession(false); // Do not create a new session
        if (session == null || principal == null) {
>>>>>>> c86b59f5a44db58bcd910fc19b0c61ceb1cdb006
=======
    // Get Current User (JWT-based; returns DTO)
    @GetMapping("/current-user")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
>>>>>>> f091a6cbcbbccfa51b1caa9eb87dc9e91edbfd74
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session found!");
        }
        UserEntity user = uServ.findByUsername(authentication.getName());
        return ResponseEntity.ok(uServ.toDTO(user));
    }
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> c86b59f5a44db58bcd910fc19b0c61ceb1cdb006
=======
>>>>>>> f091a6cbcbbccfa51b1caa9eb87dc9e91edbfd74
}
