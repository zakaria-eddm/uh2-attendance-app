package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.TpDto;
import com.aukhtubut.uh2.attendance.dtos.TpDtoExt;
import com.aukhtubut.uh2.attendance.dtos.TpDtoExtArray;

public interface TpService {
    public TpDtoExtArray getTp();

    public TpDtoExt getTpByNom(String nom);

    public TpDtoExt createTp(TpDto tp);
//public TpDtoExt createTp(String name,String ann_univ, String professor, String department);

    public TpDtoExt updateTp(TpDto tp, String name);
//public TpDtoExt updateTp(String name,String ann_univ, String professor, String department, String nom);


    public void deleteTp(String nom);
}
