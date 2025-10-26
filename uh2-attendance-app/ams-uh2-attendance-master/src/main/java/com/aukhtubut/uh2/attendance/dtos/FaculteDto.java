package com.aukhtubut.uh2.attendance.dtos;

import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class FaculteDto {
    @NonNull
    private String name;

    private String short_name;

    private String complet_name;

    private Set<DepartementsDto> departments;

    private String university;
}
