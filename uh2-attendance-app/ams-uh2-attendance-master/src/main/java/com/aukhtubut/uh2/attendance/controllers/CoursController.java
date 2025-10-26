package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.aukhtubut.uh2.attendance.services.CourService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
public class CoursController {
    @Autowired
    CourService courService;

    @GetMapping("/cours")
    public ResponseEntity<CourDtoExtArray> cours() {
        return ResponseEntity.ok(courService.getCours());
    }


    @GetMapping("/cour/{name}")
    public ResponseEntity<CourDtoExt> getCourByNom(@PathVariable String name) {
        CourDtoExt result = courService.getCoursByNom(name);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }


    @PostMapping("/cour")
    public ResponseEntity<CourDtoExt> createCour(@RequestBody CourDto cour) {
        CourDtoExt result = courService.createCour(cour);
//        CourDtoExt result = courService.createCour(cour.getName(),cour.getAnn_univ(), cour.getProfessor(), cour.getDepartment());
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }


    @PutMapping("/cour/{name}")
    public ResponseEntity<CourDtoExt> updateCour(@RequestBody CourDto cour,@PathVariable String name) {
        CourDtoExt result = courService.updateCour(cour,name);
//        CourDtoExt result = courService.updateCour( cour.getName(), cour.getAnn_univ(), cour.getProfessor(), cour.getDepartment(),nom);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @DeleteMapping("/cour/{nom}")
    public ResponseEntity<Void> deleteCour(@PathVariable String nom) {
        courService.deleteCour(nom);
        return ResponseEntity.noContent().build();
    }


}
