package com.elementopia.database.controller;

import com.elementopia.database.dto.StudentDTO;
import com.elementopia.database.entity.StudentEntity;
import com.elementopia.database.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Get all students with userId
    @GetMapping("/getAll")
    public List<StudentDTO> getAllStudents() {
        List<StudentEntity> students = studentService.getAllStudents();
        
        // Convert to DTO that includes userId
        return students.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get student by ID with userId
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        Optional<StudentEntity> student = studentService.getStudentById(id);
        return student.map(s -> ResponseEntity.ok(convertToDTO(s)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Helper method to convert Entity to DTO
    private StudentDTO convertToDTO(StudentEntity student) {
        StudentDTO dto = new StudentDTO();
        dto.setStudentId(student.getStudentId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        
        // Get userId from UserEntity
        if (student.getUser() != null) {
            dto.setUserId(student.getUser().getUserId());
        }
        
        // Add section if needed
        if (student.getSection() != null) {
            dto.setSection(student.getSection());
        }
        
        return dto;
    }

    // Assign a user to student role
    @PostMapping("/assign/{userId}")
    public ResponseEntity<?> assignStudent(@PathVariable Long userId) {
        try {
            StudentEntity student = studentService.assignStudentRole(userId);
            return ResponseEntity.ok(convertToDTO(student));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete student
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok("Student deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}