package com.aukhtubut.uh2.attendance.dtos;

import lombok.*;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DepartementDto {
    @NonNull
    private String name;

    private String short_name;

    private String complet_name;

    private String faculty;

}
