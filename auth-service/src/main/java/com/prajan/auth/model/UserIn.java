package com.prajan.auth.model;

import com.prajan.auth.enums.provider;
import com.prajan.common.enums.Role;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserIn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String name;

    private String password;

    private String providerId;

    @Enumerated(EnumType.STRING)
    private provider provider;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(nullable = false)
    private boolean active = true;


    @Override
    public String toString() {
        return "UserIn{" +
                "email='" + email + '\'' +
                ", provider=" + provider +
                ", role=" + role +
                '}';
    }
}
