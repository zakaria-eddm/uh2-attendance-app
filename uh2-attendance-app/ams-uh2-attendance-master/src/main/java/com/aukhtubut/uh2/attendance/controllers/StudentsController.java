package com.aukhtubut.uh2.attendance.controllers;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.aukhtubut.uh2.attendance.services.StudentsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController
public class StudentsController {

    @Autowired
    StudentsService studentsService;

    @GetMapping("/students")
    public ResponseEntity<StudentDtoExtArray> students() {
        return ResponseEntity.ok(studentsService.getStudents());
    }
    @GetMapping("/checkStudent/{studentQr}")
    public ResponseEntity<StudentDtoExt> checkStudent(@PathVariable String studentQr) {
        StudentDtoExt result = studentsService.getStudentsByCne(studentQr);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }
    @GetMapping("/student/{name}")
    public ResponseEntity<StudentDtoExt> getStudentsByCne(@PathVariable String name) {
        StudentDtoExt result = studentsService.getStudentsByCne(name);
        if(result.getData() != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.notFound().build();
    }

    @PostMapping("/student")
    public ResponseEntity<StudentDtoExt> createStudent(@RequestBody StudentDto student) {
        StudentDtoExt result = studentsService.createStudent(student);
        if(result != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }


    @PutMapping("/student/{name}")
    public ResponseEntity<StudentDtoExt> updateStudent(@RequestBody StudentDto student, @PathVariable String name) {
        StudentDtoExt result = studentsService.updateStudent(student,name);
        if(result != null)
            return ResponseEntity.ok(result);
        else
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
    }

    @DeleteMapping("/student/{cne}")
    public ResponseEntity<Void> deleteStudent(@PathVariable String cne) {
        studentsService.deleteStudent(cne);
        return ResponseEntity.noContent().build();
    }

}
