package com.prajan.theatre.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "theatres")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Theatre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String address;

    private String city;

    private String state;

    private String pincode;

    private Double latitude;

    private Double longitude;

    private String phone;

    private String email;

    private Boolean active;

    @OneToMany(mappedBy = "theatre")
    private List<Screen> screens;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;
}