package com.prajan.payment.entity;

import com.prajan.common.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long bookingId;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String currency;

    @Column(unique = true)
    private String razorpayOrderId;

    private String razorpayPaymentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    @PrePersist
    protected void onCreate() {

        createdAt =
                LocalDateTime.now();

        updatedAt =
                LocalDateTime.now();
    }


    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }
}