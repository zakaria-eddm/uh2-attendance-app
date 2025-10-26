package com.aukhtubut.uh2.attendance.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.Setter;

import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
public class StudentDto {
//    @NonNull
    private String name;

    private String cne;

    private String nom;

    private String prenom;

    private String cin;

    private String cycle;

    private String filiere;

    private String semestre;

    private String univ_email;

    private String perso_email;

}
