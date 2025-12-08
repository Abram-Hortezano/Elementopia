package com.elementopia.database.service;

import com.elementopia.database.entity.LessonEntity;
import com.elementopia.database.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepo;

    public LessonEntity createLesson(LessonEntity lesson) {
        return lessonRepo.save(lesson);
    }

    public LessonEntity getLesson(Long id) {
        return lessonRepo.findById(id).orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    public List<LessonEntity> getAllLessons() {
        return lessonRepo.findAll();
    }


    public LessonEntity updateDescription(Long lessonId, String newDescription) {
        LessonEntity lesson = getLesson(lessonId);
        lesson.setDescription(newDescription);
        return lessonRepo.save(lesson);
    }

}
