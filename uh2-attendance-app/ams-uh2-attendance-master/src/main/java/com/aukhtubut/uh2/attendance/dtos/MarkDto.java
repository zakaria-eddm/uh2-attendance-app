package com.aukhtubut.uh2.attendance.dtos;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MarkDto {

    //private String doctype;
    @NonNull
    private String schedule;
    @NonNull
    private String student;

}
