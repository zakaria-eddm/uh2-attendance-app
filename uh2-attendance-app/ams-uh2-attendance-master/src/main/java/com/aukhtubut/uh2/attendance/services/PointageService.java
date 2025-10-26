package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.PointageDto;
import com.aukhtubut.uh2.attendance.dtos.PointageDtoExt;
import com.aukhtubut.uh2.attendance.dtos.PointageDtoExtArray;

public interface PointageService {

    public PointageDtoExtArray getPointages();

    public PointageDtoExt getPointageByName(String name);

    public PointageDtoExt updatePointage(PointageDto pointage, String name);
    public PointageDtoExt CreatePointage(PointageDto pointage);
//public PointageDtoExt updatePointage( String name,String schedule,String etudiant,String date_effet, String status, String nom);
    public  void deletePointage(String name);
}
