package com.elementopia.database.service;

import com.elementopia.database.entity.ScoreEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.repository.ScoreRepository;
import com.elementopia.database.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class ScoreService {

    @Autowired
    private ScoreRepository scoreRepo;

    @Autowired
    private UserRepository userRepo;

    /** Create a new score record for a user, initialized to zero. */
    public ScoreEntity createScore(Long userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User not found"));
        if (scoreRepo.findByUser_UserId(userId).isPresent()) {
            throw new IllegalStateException("Score already exists for user");
        }
        ScoreEntity score = new ScoreEntity();
        score.setUser(user);
        score.setCareerScore(0);
        return scoreRepo.save(score);
    }

    /** Get a user's score. */
    public ScoreEntity getByUserId(Long userId) {
        return scoreRepo.findByUser_UserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Score not found"));
    }

    /** Replace a user's career score. */
    public ScoreEntity updateScore(Long userId, Integer newScore) {
        ScoreEntity score = getByUserId(userId);
        score.setCareerScore(newScore);
        return scoreRepo.save(score);
    }

    /** Add (increment) to a user's career score. */
    public ScoreEntity addScore(Long userId, Integer delta) {
        ScoreEntity score = getByUserId(userId);
        score.setCareerScore(score.getCareerScore() + delta);
        return scoreRepo.save(score);
    }

    /** Delete a user's score record. */
    public void deleteScore(Long userId) {
        ScoreEntity score = getByUserId(userId);
        scoreRepo.delete(score);
    }
}
