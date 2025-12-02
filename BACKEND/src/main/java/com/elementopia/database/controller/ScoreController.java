package com.elementopia.database.controller;

import com.elementopia.database.dto.ScoreDTO;
import com.elementopia.database.entity.ScoreEntity;
import com.elementopia.database.service.ScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/score")
@CrossOrigin(origins = "*")
public class ScoreController {

    @Autowired
    private ScoreService scoreService;

    /** Create a score record for a user */
    @PostMapping("/create/{userId}")
    public ResponseEntity<ScoreEntity> createScore(@PathVariable Long userId) {
        return ResponseEntity.ok(scoreService.createScore(userId));
    }

    /** Get score by userId */
    @GetMapping("/{userId}")
    public ResponseEntity<ScoreEntity> getScore(@PathVariable Long userId) {
        return ResponseEntity.ok(scoreService.getByUserId(userId));
    }

    /** Get all scores */
    @GetMapping("/all")
    public ResponseEntity<List<ScoreEntity>> getAllScores() {
        return ResponseEntity.ok(scoreService.getAllScores());
    }

    /** Replace a user's score using ScoreDTO */
    @PutMapping("/update/{userId}")
    public ResponseEntity<ScoreEntity> updateScoreWithLesson(
            @PathVariable Long userId,
            @RequestBody ScoreDTO request
    ) {
        return ResponseEntity.ok(scoreService.updateScoreWithLesson(userId, request));
    }

    /** Increment score using ScoreDTO */
    @PostMapping("/add/{userId}")
    public ResponseEntity<ScoreEntity> addScore(
            @PathVariable Long userId,
            @RequestBody ScoreDTO request
    ) {
        return ResponseEntity.ok(scoreService.addScore(userId, request.getScore()));
    }

    /** 
     * Add challenge score - NEW ENDPOINT
     * Body: { "points": 100 }
     */
    @PostMapping("/challenge/{userId}")
    public ResponseEntity<ScoreEntity> addChallengeScore(
            @PathVariable Long userId,
            @RequestBody Map<String, Integer> body
    ) {
        Integer points = body.get("points");
        if (points == null) {
            points = 100; // Default to 100 points
        }
        return ResponseEntity.ok(scoreService.addChallengeScore(userId, points));
    }

    /** Delete score record */
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteScore(@PathVariable Long userId) {
        scoreService.deleteScore(userId);
        return ResponseEntity.ok("Score deleted successfully");
    }
}