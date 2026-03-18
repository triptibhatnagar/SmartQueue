package com.hey.doc.controller;

import org.springframework.web.bind.annotation.RestController;

import com.hey.doc.model.Student;
import com.hey.doc.service.StudentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class StudentController {
    private final StudentService service;
    public StudentController(StudentService service) {
        this.service = service;
    }
    @PostMapping("/add")
    public Student addStudent(@RequestBody Student s) {
        return service.addStudent(s);
    }

    @GetMapping("/students")
    public List<Student> getStudents() {
        return service.getStudents();
    }
}