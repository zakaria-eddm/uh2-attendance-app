package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.LieuDtoExt;
import com.aukhtubut.uh2.attendance.dtos.LieuDtoExtArray;

public interface LieuService {

    public LieuDtoExtArray getLieu();

    public LieuDtoExt getLieuByNom(String name);


}
