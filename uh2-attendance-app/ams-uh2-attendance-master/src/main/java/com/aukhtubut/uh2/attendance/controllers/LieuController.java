package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.LieuDtoExt;
import com.aukhtubut.uh2.attendance.dtos.LieuDtoExtArray;
import com.aukhtubut.uh2.attendance.services.LieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin("*")
@RestController
public class LieuController {
    @Autowired
    LieuService lieuService;

    @GetMapping("/lieus")
    public ResponseEntity<LieuDtoExtArray> Lieus() {
        return ResponseEntity.ok(lieuService.getLieu());
    }
    @GetMapping("/lieu/{name}")
    public ResponseEntity<LieuDtoExt> getLieuByNom(@PathVariable String name) {
        LieuDtoExt result = lieuService.getLieuByNom(name);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }
}

