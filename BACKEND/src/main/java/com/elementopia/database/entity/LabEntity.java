package com.elementopia.database.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "laboratory")
@Data
public class LabEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long labId;

    @Column(name = "laboratory_name", nullable = false)
    private String laboratoryName;

    @Column(name = "lab_code", unique = true, nullable = false)
    private String labCode;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    @JsonBackReference
    private UserEntity creator;

    @ManyToMany
    @JoinTable(
            name = "laboratory_students",
            joinColumns = @JoinColumn(name = "lab_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<UserEntity> students;

    @Column(name = "lesson")
    private String lesson;
}
