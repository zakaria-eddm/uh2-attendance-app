package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.aukhtubut.uh2.attendance.services.TdService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
public class TdController {
    @Autowired
    TdService tdService;

    @GetMapping("/td")
    public ResponseEntity<TdDtoExtArray> Td() {
        return ResponseEntity.ok(tdService.getTd());
    }

    @GetMapping("/td/{nom}")
    public ResponseEntity<TdDtoExt> getTdByNom(@PathVariable String nom) {
        TdDtoExt result = tdService.getTdByNom(nom);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }

    @PostMapping("/td")
    public ResponseEntity<TdDtoExt> createTd(@RequestBody TdDto td) {
        TdDtoExt result = tdService.createTd(td);
//        TdDtoExt result = tdService.createTd(td.getName(),td.getAnn_univ(), td.getProfessor(), td.getDepartment());
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PutMapping("/td/{name}")
    public ResponseEntity<TdDtoExt> updateTd(@RequestBody TdDto td, @PathVariable String name) {
        TdDtoExt result = tdService.updateTd(td,name);
//        TdDtoExt result = tdService.updateTd(td.getName(),td.getAnn_univ(), td.getProfessor(), td.getDepartment(),name);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @DeleteMapping("/td/{nom}")
    public ResponseEntity<Void> deleteTd(@PathVariable String nom) {
        tdService.deleteTd(nom);
        return ResponseEntity.noContent().build();
    }
}