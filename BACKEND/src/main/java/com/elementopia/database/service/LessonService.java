package com.elementopia.database.service;

import com.elementopia.database.entity.LessonEntity;
import com.elementopia.database.entity.SubtopicEntity;
import com.elementopia.database.entity.TopicEntity;
import com.elementopia.database.repository.LessonRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.elementopia.database.dto.LessonDTO;


import java.util.List;
import java.util.Optional;

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

    public LessonEntity addTopicToLesson(Long lessonId, TopicEntity topic) {
        LessonEntity lesson = getLesson(lessonId);
        topic.setLesson(lesson);
        lesson.getTopics().add(topic);
        return lessonRepo.save(lesson);
    }

    public LessonEntity addSubtopicToTopic(Long lessonId, Long topicId, SubtopicEntity subtopic) {
        LessonEntity lesson = getLesson(lessonId);
        TopicEntity topic = lesson.getTopics().stream()
                .filter(t -> t.getId().equals(topicId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        subtopic.setTopic(topic);
        topic.getSubtopics().add(subtopic);
        return lessonRepo.save(lesson);
    }

    public LessonEntity updateDescription(Long lessonId, String newDescription) {
        LessonEntity lesson = getLesson(lessonId);
        lesson.setDescription(newDescription);
        return lessonRepo.save(lesson);
    }

    public String deleteLesson(Long id) {
        if (lessonRepo.existsById(id)) {
            lessonRepo.deleteById(id);
            return "Lesson with ID " + id + " deleted successfully!";
        } else {
            return "Lesson with ID " + id + " not found!";
        }
    }

    public LessonEntity updateLesson(Long id, LessonDTO lessonDTO) {
        Optional<LessonEntity> optionalLesson = lessonRepo.findById(id);
        if (optionalLesson.isEmpty()) {
            throw new EntityNotFoundException("Lesson not found with id: " + id);
        }

        LessonEntity lesson = optionalLesson.get();
        lesson.setTitle(lessonDTO.getTitle());
        lesson.setDescription(lessonDTO.getDescription());

        return lessonRepo.save(lesson);
    }
}
