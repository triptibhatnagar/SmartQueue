package com.hey.doc.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.hey.doc.model.Student;
import com.hey.doc.repository.StudentRepository;

@Service
public class StudentService {
    private final StudentRepository repo;
    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }
    public Student addStudent(Student s) {
        return repo.save(s);
    }
    public List<Student> getStudents() {
        return repo.findAll();
    }
}
