package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.aukhtubut.uh2.attendance.services.ProfesseurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
public class ProfesseurController {
    @Autowired
    ProfesseurService professeurService;

    @GetMapping("/professeurs")
    public ResponseEntity<ProfesseurDtoExtArray> Professeurs() {
        return ResponseEntity.ok(professeurService.getProfesseurs());
    }

    @GetMapping("/professeur/{name}")
    public ResponseEntity<ProfesseurDtoExt> getProfesseurByName(@PathVariable String name) {
        ProfesseurDtoExt result = professeurService.getProfesseurByName(name);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }
    @PostMapping("/professeur")
    public ResponseEntity<ProfesseurDtoExt> createProfesseur(@RequestBody ProfesseurDto professeur) {
        ProfesseurDtoExt result = professeurService.createProfesseur(professeur);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PutMapping("/professeur/{name}")
    public ResponseEntity<ProfesseurDtoExt> updateProfesseur(@RequestBody ProfesseurDto professeur,@PathVariable String name) {
        ProfesseurDtoExt result = professeurService.updateProfesseur(professeur,name);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }


    @DeleteMapping("/professeur/{name}")
    public ResponseEntity<Void> deleteProfesseur(@PathVariable String name) {
        professeurService.deleteProfesseur(name);
        return ResponseEntity.noContent().build();
    }
}