package com.elementopia.database.controller;

import com.elementopia.database.dto.LabResponse;
import com.elementopia.database.entity.LabEntity;
import com.elementopia.database.service.LabService;
import com.elementopia.database.dto.LabCreateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
public class LabController {

    @Autowired
    private LabService labService;

    @PostMapping("/create")
    public LabResponse createLab(@RequestBody LabCreateRequest request) {
        return labService.createLab(request);
    }


    @GetMapping("/getAll")
    public List<LabEntity> getAllLabs() {
        return labService.getAllLabs();
    }

    @GetMapping("/{labCode}")
    public LabEntity getLabByCode(@PathVariable String labCode) {
        return labService.getByLabCode(labCode)
                .orElseThrow(() -> new RuntimeException("Lab not found"));
    }

    @PutMapping("/{labCode}/add-student")
    public LabEntity addStudent(@PathVariable String labCode, @RequestParam Long studentId) {
        return labService.addStudentToLab(labCode, studentId);
    }

    @DeleteMapping("/{labId}")
    public void deleteLab(@PathVariable Long labId) {
        labService.deleteLab(labId);
    }

    @PutMapping("/{labCode}/add-lesson")
    public LabEntity addLesson(@PathVariable String labCode, @RequestParam Long lessonId) {
        return labService.addLessonToLab(labCode, lessonId);
    }

}