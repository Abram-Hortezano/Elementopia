package com.elementopia.database.service;

import com.elementopia.database.dto.ScoreDTO;
import com.elementopia.database.entity.LessonCompletionEntity;
import com.elementopia.database.entity.LessonEntity;
import com.elementopia.database.entity.ScoreEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.repository.LessonCompletionRepository;
import com.elementopia.database.repository.ScoreRepository;
import com.elementopia.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ScoreService {

    @Autowired
    private ScoreRepository scoreRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private LessonCompletionRepository lessonCompletionRepo;

    @Autowired
    private LessonCompletionService lessonCompletionService;

    private static final int MAX_SCORE = 1800; // 18 challenges × 100 points

    /** Create a new score record for a user, initialized to zero. */
    public ScoreEntity createScore(Long userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        if (scoreRepo.existsByUser_UserId(userId)) {
            throw new IllegalStateException("Score already exists for user");
        }

        ScoreEntity score = new ScoreEntity();
        score.setUser(user);
        score.setCareerScore(0);
        score.setPercentage("0%");
        return scoreRepo.save(score);
    }

    /** Get a user's score. Creates one if it doesn't exist. */
    public ScoreEntity getByUserId(Long userId) {
        return scoreRepo.findByUser_UserId(userId)
                .orElseGet(() -> createScore(userId));
    }

    public List<ScoreEntity> getAllScores() {
        return scoreRepo.findAll();
    }

    /** Replace a user's career score. */
    public ScoreEntity updateScore(Long userId, Integer newScore) {
        ScoreEntity score = getByUserId(userId);
        score.setCareerScore(newScore);
        updatePercentage(score);
        return scoreRepo.save(score);
    }

    /** Add to a user's score. */
    public ScoreEntity addScore(Long userId, Integer delta) {
        ScoreEntity score = getByUserId(userId);
        score.setCareerScore(score.getCareerScore() + delta);
        updatePercentage(score);
        return scoreRepo.save(score);
    }

    /** 
     * Add points when a challenge is completed.
     * This is the main method to call from the frontend.
     */
    public ScoreEntity addChallengeScore(Long userId, Integer points) {
        ScoreEntity score = getByUserId(userId);
        score.setCareerScore(score.getCareerScore() + points);
        updatePercentage(score);
        return scoreRepo.save(score);
    }

    /** 
     * Recalculate and set the percentage based on current score.
     */
    private void updatePercentage(ScoreEntity score) {
        double percentage = (score.getCareerScore() * 100.0) / MAX_SCORE;
        // Cap at 100%
        if (percentage > 100) percentage = 100;
        score.setPercentage(String.format("%.1f%%", percentage));
    }

    /** Delete a user's score record. */
    public void deleteScore(Long userId) {
        ScoreEntity score = getByUserId(userId);
        scoreRepo.delete(score);
    }

    /** Legacy method - kept for backward compatibility */
    public ScoreEntity updateScoreWithLesson(Long userId, ScoreDTO request) {
        ScoreEntity score = getByUserId(userId);

        // 1. Update career score
        score.setCareerScore(score.getCareerScore() + request.getScore());

        // 2. Update percentage
        updatePercentage(score);

        // 3. Log lesson completion
        lessonCompletionService.completeLesson(userId, request.getLessonId());

        // 4. Save updated score
        return scoreRepo.save(score);
    }
}