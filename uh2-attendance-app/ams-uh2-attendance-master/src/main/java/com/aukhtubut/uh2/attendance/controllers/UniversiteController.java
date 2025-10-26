package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.UniversiteDtoExt;
import com.aukhtubut.uh2.attendance.dtos.UniversiteDtoExtArray;
import com.aukhtubut.uh2.attendance.services.UniversiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
public class UniversiteController {
    @Autowired
    UniversiteService universiteService;
    @GetMapping("/universites")
    public ResponseEntity<UniversiteDtoExtArray> Universites() {
        return ResponseEntity.ok(universiteService.getUniversites());
    }
@GetMapping("/universite/{name}")
public ResponseEntity<UniversiteDtoExt> getUniversiteByName(@PathVariable String name) {
    UniversiteDtoExt result = universiteService.getUniversiteByName(name);
    if(result.getData() != null)
        return ResponseEntity.ok(result);
    else
        return ResponseEntity.notFound().build();
}
}