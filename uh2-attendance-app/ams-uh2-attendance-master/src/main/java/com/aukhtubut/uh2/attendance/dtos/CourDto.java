package com.aukhtubut.uh2.attendance.dtos;

import lombok.*;

import java.time.Year;
import java.util.Set;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CourDto {
//    @NonNull
    private String name;
//    @NonNull
    private String code_cours;//Code cours

    private String ann_univ;

    private String professor;
    private String department;

    private Set<StudentsDto> etudiants;
}


