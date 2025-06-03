package com.elementopia.database.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LabResponse {
    private Long labId;
    private String laboratoryName;
}
