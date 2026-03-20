package com.hey.doc;

import com.hey.doc.model.*;
import com.hey.doc.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
@EnableScheduling
@RequiredArgsConstructor
public class DocApplication {

	public static void main(String[] args) {
		SpringApplication.run(DocApplication.class, args);
	}

	@Bean
	CommandLineRunner createAdmin(UserRepository userRepository,
								  PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByEmail("admin@smartqueue.com")) {
				User admin = User.builder()
						.name("Admin")
						.email("admin@smartqueue.com")
						.password(passwordEncoder.encode("Admin@123"))
						.role(Role.ADMIN)
						.isActive(true)
						.build();
				userRepository.save(admin);
				System.out.println("✅ Admin created: admin@smartqueue.com / Admin@123");
			}
		};
	}
}