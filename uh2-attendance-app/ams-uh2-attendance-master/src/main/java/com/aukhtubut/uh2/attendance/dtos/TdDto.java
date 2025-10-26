package com.aukhtubut.uh2.attendance.dtos;
import lombok.*;

import java.time.Year;
import java.util.Set;
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder

public class TdDto {
//        @NonNull
        private String name;
//        @NonNull
        private String code_td;//Code TD

        private String ann_univ;

        private String professor;

        private Set<StudentsDto> etudiants;

        private String department;

}
