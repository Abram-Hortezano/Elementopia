package com.elementopia.database.controller;

import com.elementopia.database.entity.LessonCompletionEntity;
import com.elementopia.database.service.LessonCompletionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lesson-completion")
public class LessonCompletionController {

    @Autowired
    private LessonCompletionService lcService;

    // Mark a lesson as completed by a student
    @PostMapping("/complete")
    public ResponseEntity<?> completeLesson(@RequestBody Map<String, Long> body) {
        Long studentId = body.get("studentId");
        Long lessonId = body.get("lessonId");
        return ResponseEntity.ok(lcService.completeLesson(studentId, lessonId));
    }

    // All completions of a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LessonCompletionEntity>> getByUser(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(lcService.getCompletionsByUser(userId));
    }

    // All completions for a lesson
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<LessonCompletionEntity>> getByLesson(
            @PathVariable Long lessonId
    ) {
        return ResponseEntity.ok(lcService.getCompletionsByLesson(lessonId));
    }

    // Delete a completion record
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCompletion(@PathVariable Long id) {
        return ResponseEntity.ok(lcService.deleteCompletion(id));
    }
}
