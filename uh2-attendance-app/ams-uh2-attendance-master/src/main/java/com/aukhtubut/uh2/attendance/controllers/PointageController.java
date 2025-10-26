package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.aukhtubut.uh2.attendance.services.PointageService;
import com.aukhtubut.uh2.attendance.services.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.yaml.snakeyaml.error.Mark;


@CrossOrigin("*")
@RestController
public class PointageController {

    @Autowired
    ScheduleService scheduleService;
    @Autowired
    PointageService pointageService;
    @GetMapping("/pointages")
    public ResponseEntity<PointageDtoExtArray> Pointage() {
        return ResponseEntity.ok(pointageService.getPointages());
    }

//    @GetMapping("/pointage")
//    public ResponseEntity<PointageDtoExtArray> Pointage() {
//        return ResponseEntity.ok(pointageService.getPointages());
//    }
    @GetMapping("/pointage/{name}")
    public ResponseEntity<PointageDtoExt> getPointageByName(@PathVariable String name) {
        PointageDtoExt result = pointageService.getPointageByName(name);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }

    @PostMapping("/markAttendance")
    public ResponseEntity<PointageDtoExt> schedules(@RequestBody MarkDto markDto) {
        PointageDtoExt result = scheduleService.markPresence(markDto.getStudent(), markDto.getSchedule());
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
    @PostMapping("/pointage")
    public ResponseEntity<PointageDtoExt> CreatePointage(@RequestBody PointageDto pointage) {
        PointageDtoExt result = pointageService.CreatePointage(pointage);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }
    @PutMapping("/pointage/{name}")
    public ResponseEntity<PointageDtoExt> updatePointage(@RequestBody PointageDto pointage,@PathVariable String name) {
        PointageDtoExt result = pointageService.updatePointage(pointage,name);
//        PointageDtoExt result = pointageService.updatePointage(pointage.getName(),pointage.getSchedule(),pointage.getEtudiant(),pointage.getDate_effet(),pointage.getStatus(),name);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @DeleteMapping("/pointage/{name}")
    public ResponseEntity<Void> deletePointage(@PathVariable String name) {
        pointageService.deletePointage(name);
        return ResponseEntity.noContent().build();
    }

}
