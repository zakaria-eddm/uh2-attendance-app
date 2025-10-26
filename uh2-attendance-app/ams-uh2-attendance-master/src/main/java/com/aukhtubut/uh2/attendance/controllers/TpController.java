package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.aukhtubut.uh2.attendance.services.TpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
public class TpController {
    @Autowired
    TpService tpService;

    @GetMapping("/tp")
    public ResponseEntity<TpDtoExtArray> Tp() {
        return ResponseEntity.ok(tpService.getTp());
    }

    @GetMapping("/tp/{nom}")
    public ResponseEntity<TpDtoExt> checkStudent(@PathVariable String nom) {
        TpDtoExt result = tpService.getTpByNom(nom);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }

    @PostMapping("/tp")
    public ResponseEntity<TpDtoExt> createTp(@RequestBody TpDto tp) {
        TpDtoExt result = tpService.createTp(tp);
//        TpDtoExt result = tpService.createTp(tp.getName(),tp.getAnn_univ(), tp.getProfessor(), tp.getDepartment());
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PutMapping("/tp/{name}")
    public ResponseEntity<TpDtoExt> updateTp(@RequestBody TpDto tp,@PathVariable String name) {
        TpDtoExt result = tpService.updateTp(tp,name);
//        TpDtoExt result = tpService.updateTp(tp.getName(),tp.getAnn_univ(), tp.getProfessor(), tp.getDepartment(),name);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @DeleteMapping("/tp/{nom}")
    public ResponseEntity<Void> deleteTp(@PathVariable String nom) {
        tpService.deleteTp(nom);
        return ResponseEntity.noContent().build();
    }
}
