package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.DepartementDtoExt;
import com.aukhtubut.uh2.attendance.dtos.DepartementDtoExtArray;

public interface DepartementService {

    public DepartementDtoExtArray getDepartements();

    public DepartementDtoExt getDepartementByName(String name);

}
