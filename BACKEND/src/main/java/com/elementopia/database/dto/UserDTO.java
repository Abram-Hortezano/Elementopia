package com.elementopia.database.dto;

import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;

    private StudentDTO student;
    private TeacherDTO teacher;
    private List<DiscoveryDTO> discoveries;
    private List<AchievementDTO> achievements;

}
