package com.prajan.booking.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(
        name = "booking_seats",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"booking_id", "show_seat_id"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "show_seat_id", nullable = false)
    private Long showSeatId;

    @Column(nullable = false)
    private BigDecimal price;
}