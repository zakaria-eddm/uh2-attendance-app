package com.aukhtubut.uh2.attendance.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@Getter @Setter
public class ScheduleDtoExtArray {

    private Set<ScheduleDto> data;

}
