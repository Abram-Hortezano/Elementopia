package com.elementopia.database.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_completion")
@Data
public class LessonCompletionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The student who completed the lesson
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private UserEntity user;

    // The lesson that was completed
    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonBackReference
    private LessonEntity lesson;

    // Date the student finished the lesson
    @Column(name = "date_completed", nullable = false)
    private LocalDateTime dateCompleted = LocalDateTime.now();
}
