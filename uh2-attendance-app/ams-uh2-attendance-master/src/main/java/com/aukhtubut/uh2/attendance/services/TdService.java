package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.*;

public interface TdService {

    public TdDtoExtArray getTd();

    public TdDtoExt getTdByNom(String nom);

    public TdDtoExt createTd(TdDto td);
//public TdDtoExt createTd(String name,String ann_univ, String professor, String department);

    public TdDtoExt updateTd(TdDto td,String name);
//public TdDtoExt updateTd(String name,String ann_univ, String professor, String department,String nom);

    public void deleteTd(String nom);

}
