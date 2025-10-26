package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.UniversiteDtoExt;
import com.aukhtubut.uh2.attendance.dtos.UniversiteDtoExtArray;

public interface UniversiteService {

    public UniversiteDtoExtArray getUniversites();

    public UniversiteDtoExt getUniversiteByName(String name);
}
