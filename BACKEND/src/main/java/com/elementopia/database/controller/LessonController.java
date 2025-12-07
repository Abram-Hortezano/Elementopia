package com.elementopia.database.controller;

import com.elementopia.database.entity.LessonEntity;
import com.elementopia.database.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonRepository lessonRepo;

    // Create a new Lesson
    @PostMapping("/create")
    public LessonEntity createLesson(@RequestBody LessonEntity lesson) {
        return lessonRepo.save(lesson);
    }

    // Get a Lesson by ID
    @GetMapping("/get/{id}")
    public LessonEntity getLesson(@PathVariable Long id) {
        return lessonRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
    }

    // Get all Lessons
    @GetMapping("/getAll")
    public List<LessonEntity> getAllLessons() {
        return lessonRepo.findAll();
    }


}