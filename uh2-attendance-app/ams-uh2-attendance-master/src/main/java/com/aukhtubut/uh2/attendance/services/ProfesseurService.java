package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.ProfesseurDto;
import com.aukhtubut.uh2.attendance.dtos.ProfesseurDtoExt;
import com.aukhtubut.uh2.attendance.dtos.ProfesseurDtoExtArray;

public interface ProfesseurService {

    public ProfesseurDtoExtArray getProfesseurs();

    public ProfesseurDtoExt getProfesseurByName(String name);

    public ProfesseurDtoExt createProfesseur(ProfesseurDto professeur);

    public ProfesseurDtoExt updateProfesseur(ProfesseurDto professeur, String name);

    public void deleteProfesseur(String name);

}
