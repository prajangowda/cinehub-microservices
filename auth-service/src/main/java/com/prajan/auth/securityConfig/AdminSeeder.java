package com.prajan.auth.securityConfig;

import com.prajan.auth.model.UserIn;
import com.prajan.auth.repository.UserInRepository;
import com.prajan.common.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {


    private final UserInRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.findByEmail("admin@cinehub.com").isEmpty()) {

            UserIn admin = UserIn.builder()
                    .name("Admin")
                    .email("admin@cinehub.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .build();

            userRepository.save(admin);
        }
    }
}