package com.aukhtubut.uh2.attendance.dtos;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PointageDto {

//    private String doctype;
//@NonNull
    private String name;

    private String schedule;

    private String etudiant;

    private String date_effet;

    private String status;

}
