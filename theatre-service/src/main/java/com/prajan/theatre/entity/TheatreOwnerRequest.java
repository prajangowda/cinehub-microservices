package com.prajan.theatre.entity;

import com.prajan.theatre.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;



@Entity
@Table(name = "theatre_owner_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TheatreOwnerRequest {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String businessName;

    private String gstNumber;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status;

    private LocalDateTime requestedAt;
}