package com.prajan.auth.repository;

import com.prajan.auth.model.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, Long> {

    Optional<PendingRegistration> findByEmail(String email);

    void deleteByEmail(String email);

    boolean existsByEmail(String email);

    void deleteAllByOtpExpiryBefore(LocalDateTime time);


    @Modifying
    @Query("DELETE FROM PendingRegistration p WHERE p.createdAt < :time")
    void deleteByCreatedAtBefore(@Param("time") LocalDateTime time);

}