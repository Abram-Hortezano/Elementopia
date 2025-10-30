package com.elementopia.database.controller;

import com.elementopia.database.entity.LessonScoreEntity;
import com.elementopia.database.service.LessonScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lesson-scores")
@CrossOrigin(origins = "*") // Allow requests from your React frontend
@RequiredArgsConstructor
public class LessonScoreController {

    private final LessonScoreService lessonScoreService;

    // Create or update
    @PostMapping
    public ResponseEntity<LessonScoreEntity> createOrUpdateLessonScore(@RequestBody LessonScoreEntity lessonScore) {
        LessonScoreEntity saved = lessonScoreService.saveLessonScore(lessonScore);
        return ResponseEntity.ok(saved);
    }

    // Get all
    @GetMapping
    public ResponseEntity<List<LessonScoreEntity>> getAllLessonScores() {
        return ResponseEntity.ok(lessonScoreService.getAllLessonScores());
    }

    // Get by ID
    @GetMapping("/{id}")
    public ResponseEntity<LessonScoreEntity> getLessonScoreById(@PathVariable Long id) {
        return lessonScoreService.getLessonScoreById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Get by Lesson ID
    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<LessonScoreEntity> getByLessonId(@PathVariable Long lessonId) {
        LessonScoreEntity score = lessonScoreService.getLessonScoreByLessonId(lessonId);
        if (score != null) {
            return ResponseEntity.ok(score);
        }
        return ResponseEntity.notFound().build();
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLessonScore(@PathVariable Long id) {
        lessonScoreService.deleteLessonScore(id);
        return ResponseEntity.noContent().build();
    }
}
