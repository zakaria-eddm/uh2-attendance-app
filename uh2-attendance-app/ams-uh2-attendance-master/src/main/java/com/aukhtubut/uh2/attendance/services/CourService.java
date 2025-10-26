package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.CourDto;
import com.aukhtubut.uh2.attendance.dtos.CourDtoExt;
import com.aukhtubut.uh2.attendance.dtos.CourDtoExtArray;
import com.aukhtubut.uh2.attendance.dtos.StudentsDto;

public interface CourService {
    public CourDtoExtArray getCours();

    public CourDtoExt getCoursByNom(String name);

    public CourDtoExt createCour(CourDto cour);
//    public CourDtoExt createCour( String name,String ann_univ, String professor, String department);

    public CourDtoExt updateCour(CourDto cour,String name);
//    public CourDtoExt updateCour(String name, String ann_univ, String professor, String department, String nom);

    public void deleteCour(String name);

}
