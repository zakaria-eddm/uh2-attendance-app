package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.DepartementDtoExt;
import com.aukhtubut.uh2.attendance.dtos.DepartementDtoExtArray;
import com.aukhtubut.uh2.attendance.services.DepartementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
public class DepartementController {
    @Autowired
    DepartementService departementService;

    @GetMapping("/departements")
    public ResponseEntity<DepartementDtoExtArray> Departements() {
        return ResponseEntity.ok(departementService.getDepartements());
    }

    @GetMapping("/departement/{name}")
    public ResponseEntity<DepartementDtoExt> getDepartementByNom(@PathVariable String name) {
        DepartementDtoExt result = departementService.getDepartementByName(name);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }
}
