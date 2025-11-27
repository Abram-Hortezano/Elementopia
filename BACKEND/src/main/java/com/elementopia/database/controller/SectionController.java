package com.elementopia.database.controller;

import com.elementopia.database.dto.CreateSectionRequest;
import com.elementopia.database.dto.JoinSectionRequest;
import com.elementopia.database.entity.SectionEntity;
import com.elementopia.database.service.SectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/section")
public class SectionController {

    private final SectionService sectionService;

    public SectionController(SectionService sectionService) {
        this.sectionService = sectionService;
    }

    // Create a section
    @PostMapping("/create")
    public ResponseEntity<SectionEntity> createSection(@RequestBody CreateSectionRequest req) {
        return ResponseEntity.ok(sectionService.createSection(req));
    }

    // Student joins a section
    @PostMapping("/join")
    public ResponseEntity<SectionEntity> joinSection(@RequestBody JoinSectionRequest req) {
        return ResponseEntity.ok(sectionService.joinSection(req));
    }

    @GetMapping("/getClassMembers")
    public ResponseEntity<SectionEntity> getClassMembers(
            @RequestParam String code
    ) {
        SectionEntity section = sectionService.getBySectionCode(code);
        return ResponseEntity.ok(section);
    }
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<?> getSectionsByTeacher(@PathVariable Long teacherId) {
        return ResponseEntity.ok(sectionService.getSectionsByTeacher(teacherId));
    }

    @DeleteMapping("/{sectionId}")
    public ResponseEntity<Void> deleteSection(@PathVariable Long sectionId) {
        sectionService.deleteSection(sectionId);
        return ResponseEntity.noContent().build();
    }


}
