package com.elementopia.database.service;

import com.elementopia.database.dto.LabResponse;
import com.elementopia.database.entity.LabEntity;
import com.elementopia.database.entity.UserEntity;
import com.elementopia.database.repository.LabRepository;
import com.elementopia.database.repository.UserRepository;
import com.elementopia.database.dto.LabCreateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabService {

    @Autowired
    private LabRepository labRepository;

    @Autowired
    private UserRepository userRepository;

    public LabResponse createLab(LabCreateRequest request) {
        UserEntity creator = userRepository.findById(request.getCreatorId())
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        List<UserEntity> students = (request.getStudentIds() != null) ?
                request.getStudentIds().stream()
                        .map(id -> userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + id)))
                        .toList()
                : List.of();

        LabEntity lab = new LabEntity();
        lab.setLaboratoryName(request.getLaboratoryName());
        lab.setLabCode(request.getLabCode());
        lab.setLesson(request.getLesson());
        lab.setCreator(creator);
        lab.setStudents(students);

        LabEntity savedLab = labRepository.save(lab);

        return new LabResponse(savedLab.getLabId(), savedLab.getLaboratoryName());
    }



    public List<LabEntity> getAllLabs() {
        return labRepository.findAll();
    }

    public Optional<LabEntity> getByLabCode(String labCode) {
        return labRepository.findByLabCode(labCode);
    }

    public LabEntity addStudentToLab(String labCode, Long studentId) {
        LabEntity lab = labRepository.findByLabCode(labCode)
                .orElseThrow(() -> new RuntimeException("Lab not found"));

        UserEntity student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (!"STUDENT".equalsIgnoreCase(student.getRole())) {
            throw new RuntimeException("User is not a student");
        }

        lab.getStudents().add(student);
        return labRepository.save(lab);
    }

    public void deleteLab(Long labId) {
        labRepository.deleteById(labId);
    }
}

