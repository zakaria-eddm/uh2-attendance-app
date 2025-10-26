package com.aukhtubut.uh2.attendance.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class ScheduleDto {

//    private String doctype;
    private String name;
    @NonNull
    private String schedule_code;//Code plannification

    private String course;

    private String td;

    private String tp;

    private String start_datetime;

    private String end_datetime;

    private String location;

}
