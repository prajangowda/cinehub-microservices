package com.prajan.booking.repository;

import com.prajan.booking.entity.Booking;
import com.prajan.common.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByBookingReference(
            String bookingReference
    );

    List<Booking> findByStatusAndBookedAtBefore(
            BookingStatus status,
            LocalDateTime bookedAt
    );

    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

}