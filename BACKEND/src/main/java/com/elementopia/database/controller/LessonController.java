package com.elementopia.database.controller;

import com.elementopia.database.entity.LessonEntity;
import com.elementopia.database.entity.TopicEntity;
import com.elementopia.database.entity.SubtopicEntity;
import com.elementopia.database.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    // Add a Topic to a Lesson
    @PostMapping("/{lessonId}/addTopic")
    public LessonEntity addTopic(@PathVariable Long lessonId, @RequestBody TopicEntity topic) {
        LessonEntity lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        topic.setLesson(lesson);
        lesson.getTopics().add(topic);
        return lessonRepo.save(lesson);
    }

    // Add a Subtopic to a Topic within a Lesson
    @PostMapping("/{lessonId}/topic/{topicId}/add-subtopic")
    public LessonEntity addSubtopic(@PathVariable Long lessonId, @PathVariable Long topicId, @RequestBody SubtopicEntity subtopic) {
        LessonEntity lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        TopicEntity topic = lesson.getTopics().stream()
                .filter(t -> t.getId().equals(topicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        subtopic.setTopic(topic);
        topic.getSubtopics().add(subtopic);
        return lessonRepo.save(lesson);
    }

    // Update a Topic within a Lesson
    @PutMapping("/{lessonId}/topic/{topicId}/update")
    public LessonEntity updateTopic(@PathVariable Long lessonId, @PathVariable Long topicId, @RequestBody TopicEntity updatedTopic) {
        LessonEntity lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        TopicEntity topic = lesson.getTopics().stream()
                .filter(t -> t.getId().equals(topicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        topic.setTitle(updatedTopic.getTitle());
        return lessonRepo.save(lesson);
    }

    // Delete a Topic from a Lesson
    @DeleteMapping("/{lessonId}/topic/{topicId}/delete")
    public ResponseEntity<?> deleteTopic(@PathVariable Long lessonId, @PathVariable Long topicId) {
        LessonEntity lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        TopicEntity topic = lesson.getTopics().stream()
                .filter(t -> t.getId().equals(topicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        lesson.getTopics().remove(topic);
        lessonRepo.save(lesson);
        return ResponseEntity.ok("Topic deleted successfully.");
    }

    // Update a Subtopic within a Topic
    @PutMapping("/{lessonId}/topic/{topicId}/subtopic/{subtopicId}/update")
    public LessonEntity updateSubtopic(@PathVariable Long lessonId, @PathVariable Long topicId,
                                       @PathVariable Long subtopicId, @RequestBody SubtopicEntity updatedSubtopic) {
        LessonEntity lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        TopicEntity topic = lesson.getTopics().stream()
                .filter(t -> t.getId().equals(topicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        SubtopicEntity subtopic = topic.getSubtopics().stream()
                .filter(s -> s.getId().equals(subtopicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Subtopic not found"));
        subtopic.setTitle(updatedSubtopic.getTitle());
        subtopic.setContent(updatedSubtopic.getContent());
        return lessonRepo.save(lesson);
    }

    // Delete a Subtopic from a Topic
    @DeleteMapping("/{lessonId}/topic/{topicId}/subtopic/{subtopicId}/delete")
    public ResponseEntity<?> deleteSubtopic(@PathVariable Long lessonId, @PathVariable Long topicId,
                                            @PathVariable Long subtopicId) {
        LessonEntity lesson = lessonRepo.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        TopicEntity topic = lesson.getTopics().stream()
                .filter(t -> t.getId().equals(topicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Topic not found"));
        SubtopicEntity subtopic = topic.getSubtopics().stream()
                .filter(s -> s.getId().equals(subtopicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Subtopic not found"));
        topic.getSubtopics().remove(subtopic);
        lessonRepo.save(lesson);
        return ResponseEntity.ok("Subtopic deleted successfully.");
    }
}
