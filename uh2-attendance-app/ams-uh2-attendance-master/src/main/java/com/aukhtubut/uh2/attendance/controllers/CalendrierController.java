package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.aukhtubut.uh2.attendance.services.CalendrierService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController
public class CalendrierController {
    @Autowired
    CalendrierService calendrierService;

    @GetMapping("/calendriers")
    public ResponseEntity<CalendrierDtoExtArray> Calendriers() {
        return ResponseEntity.ok(calendrierService.getCalendriers());
    }

    @GetMapping("/calendrier/{name}")
    public ResponseEntity<CalendrierDtoExt> getCalendrierById(@PathVariable String name) {
        CalendrierDtoExt result = calendrierService.getCalendrierById(name);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }
    @PostMapping("/calendrier")
    public ResponseEntity<CalendrierDtoExt> createCalendrier(@RequestBody CalendrierDto calendrier) {
        CalendrierDtoExt result = calendrierService.createCalendrier(calendrier);
//        CalendrierDtoExt result = calendrierService.createCalendrier(calendrier.getName(),calendrier.getReference_doctype(), calendrier.getSubject_field(),calendrier.getStart_date_field(),calendrier.getEnd_date_field());
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PutMapping("/calendrier/{name}")
    public ResponseEntity<CalendrierDtoExt> updateCalendrier(@RequestBody CalendrierDto calendrier, @PathVariable String name) {
        CalendrierDtoExt result = calendrierService.updateCalendrier( calendrier,name);
//        CalendrierDtoExt result = calendrierService.updateCalendrier( calendrier.getName(),calendrier.getReference_doctype(), calendrier.getSubject_field(),calendrier.getStart_date_field(),calendrier.getEnd_date_field(),name);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @DeleteMapping("/calendrier/{name}")
    public ResponseEntity<Void> deleteCour(@PathVariable String name) {
        calendrierService.deleteCalendrier(name);
        return ResponseEntity.noContent().build();
    }
}