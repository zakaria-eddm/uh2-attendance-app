package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.FaculteDtoExt;
import com.aukhtubut.uh2.attendance.dtos.FaculteDtoExtArray;

public interface FaculteService {

    public FaculteDtoExtArray getFacultes();

    public FaculteDtoExt getFaculteByName(String name);

}
