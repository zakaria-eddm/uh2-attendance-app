package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.FaculteDtoExt;
import com.aukhtubut.uh2.attendance.dtos.FaculteDtoExtArray;
import com.aukhtubut.uh2.attendance.services.FaculteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
public class FaculteController {
    @Autowired
    FaculteService faculteService;

    @GetMapping("/faculte")
    public ResponseEntity<FaculteDtoExtArray> cours() {
        return ResponseEntity.ok(faculteService.getFacultes());
    }


    @GetMapping("/faculte/{name}")
    public ResponseEntity<FaculteDtoExt> getFaculteByName(@PathVariable String name) {
        FaculteDtoExt result = faculteService.getFaculteByName(name);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }
}