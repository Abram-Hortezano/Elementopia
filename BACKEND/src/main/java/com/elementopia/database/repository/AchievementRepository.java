package com.elementopia.database.repository;

import com.elementopia.database.entity.AchievementEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<AchievementEntity, Long> {
    List<AchievementEntity> findByUser_UserId(Long userId);
    
    Optional<AchievementEntity> findByCodeName(String codeName);
    
    boolean existsByUser_UserIdAndCodeName(Long userId, String codeName);

}