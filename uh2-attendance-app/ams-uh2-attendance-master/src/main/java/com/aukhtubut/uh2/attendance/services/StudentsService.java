package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.StudentDto;
import com.aukhtubut.uh2.attendance.dtos.StudentDtoExt;
import com.aukhtubut.uh2.attendance.dtos.StudentDtoExtArray;

public interface StudentsService {
	
	public StudentDtoExtArray getStudents();

	public StudentDtoExt getStudentsByCne(String cne);
//	public Mono<StudentDtoExt> createStudent(StudentDtoExt student);
//	public Mono<StudentDtoExt> updateStudent(String cne, StudentDtoExt student);
	public StudentDtoExt createStudent(StudentDto student);

	public StudentDtoExt updateStudent(StudentDto student,String name);

	public void deleteStudent(String cne);

}
