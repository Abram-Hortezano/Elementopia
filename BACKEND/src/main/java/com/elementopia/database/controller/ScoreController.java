package com.elementopia.database.controller;

import com.elementopia.database.entity.ScoreEntity;
import com.elementopia.database.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/score")
public class ScoreController {

    @Autowired
    private ScoreService scoreService;

    // Create (initialize) score record for a user
    @PostMapping("/create/{userId}")
    public ResponseEntity<ScoreEntity> createScore(@PathVariable Long userId) {
        return ResponseEntity.ok(scoreService.createScore(userId));
    }

    // Read: get score by user
    @GetMapping("/{userId}")
    public ResponseEntity<ScoreEntity> getScore(@PathVariable Long userId) {
        return ResponseEntity.ok(scoreService.getByUserId(userId));
    }

    // Update: overwrite careerScore
    @PutMapping("/update/{userId}")
    public ResponseEntity<ScoreEntity> updateScore(
            @PathVariable Long userId,
            @RequestParam Integer newScore
    ) {
        return ResponseEntity.ok(scoreService.updateScore(userId, newScore));
    }

    // Add: increment careerScore by delta
    @PostMapping("/add/{userId}")
    public ResponseEntity<ScoreEntity> addScore(
            @PathVariable Long userId,
            @RequestParam Integer delta
    ) {
        return ResponseEntity.ok(scoreService.addScore(userId, delta));
    }

    // Delete: remove score record
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteScore(@PathVariable Long userId) {
        scoreService.deleteScore(userId);
        return ResponseEntity.ok("Score deleted successfully");
    }
}
