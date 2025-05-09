package com.elementopia.database.repository;

import com.elementopia.database.entity.AchievementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<AchievementEntity, Long> {
    List<AchievementEntity> findByUser_UserId(Long userId);
    
    // Find achievement by title instead of code name
    Optional<AchievementEntity> findByTitle(String title);
    
    // Check if a user has already unlocked an achievement
    boolean existsByUser_UserIdAndTitle(Long userId, String title);
}