package com.aukhtubut.uh2.attendance.dtos;

import lombok.*;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ProfesseurDto {
    private  String name;
    @NonNull
    private  String full_name;//Nom complet

    private String nom;

    private String prenom;

    private String cin;

    private String univ_email;

    private String perso_email;

    private String department;

}
