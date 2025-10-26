package com.aukhtubut.uh2.attendance.dtos;

import lombok.*;

import java.time.Year;
import java.util.Set;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TpDto {
//    @NonNull
    private String name;
//    @NonNull
    private String code_tp;//Code TP

    private String ann_univ;

    private String professor;

    private Set<StudentsDto> etudiants;

    private String department;

}
