package com.aukhtubut.uh2.attendance.dtos;

import lombok.*;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class LieuDto {
    @NonNull
    private String name;

    private String building_name;

    private String classroom_number;

    private int capacity;
}
