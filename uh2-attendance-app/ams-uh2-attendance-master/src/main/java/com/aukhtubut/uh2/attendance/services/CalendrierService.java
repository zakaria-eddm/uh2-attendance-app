package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.CalendrierDto;
import com.aukhtubut.uh2.attendance.dtos.CalendrierDtoExt;
import com.aukhtubut.uh2.attendance.dtos.CalendrierDtoExtArray;

public interface CalendrierService {

    public CalendrierDtoExtArray getCalendriers();

    public CalendrierDtoExt getCalendrierById(String name);

    public CalendrierDtoExt createCalendrier(CalendrierDto calendrier);
//    public CalendrierDtoExt createCalendrier(String name,String reference_doctype, String subject_field,String start_date_field,String end_date_field);

    public CalendrierDtoExt updateCalendrier(CalendrierDto calendrier, String name);
//    public CalendrierDtoExt updateCalendrier(String name,String reference_doctype, String subject_field,String start_date_field,String end_date_field, String nom);

    public void  deleteCalendrier(String name);

}
