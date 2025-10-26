package com.aukhtubut.uh2.attendance.dtos;

import lombok.*;

import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CalendrierDto {
//    @NotBlank(message = "ce champ est obligatoire ")
//    @Size(min=9 ,max=10,message="le nombre de charactere doit compris entre 9 et 10")
//    @NonNull(message = "le Nom est obligatoire !!")
//    @NonNull
    private String name;

    private String reference_doctype;

    private String subject_field;

    private String start_date_field;

    private String end_date_field;
    
}
