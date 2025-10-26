package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.aukhtubut.uh2.attendance.services.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController
public class SchedulesController {

    @Autowired
    ScheduleService scheduleService;

    @GetMapping("/schedules")
    public ResponseEntity<ScheduleDtoExtArray> schedules() {
        return ResponseEntity.ok(scheduleService.getSchedules());
    }

    @GetMapping("/schedule/{name}")
    public ResponseEntity<ScheduleDtoExt> getPointageByName(@PathVariable String name) {
        ScheduleDtoExt result = scheduleService.getScheduleByName(name);
        if (result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }

    @PostMapping("/schedule")
    public ResponseEntity<ScheduleDtoExt> createSchedule(@RequestBody ScheduleDto schedule) {
        ScheduleDtoExt result = scheduleService.createSchedule(schedule);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @PutMapping("/schedule/{name}")
    public ResponseEntity<ScheduleDtoExt> updateSchedule(@RequestBody ScheduleDto schedule,@PathVariable String name) {
        ScheduleDtoExt result = scheduleService.updateSchedule(schedule,name);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @DeleteMapping("/schedule/{name}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable String name) {
        scheduleService.deleteSchedule(name);
        return ResponseEntity.noContent().build();
    }
}
