package com.prajan.theatre.repository;

import com.prajan.theatre.entity.TheatreOwnerRequest;
import com.prajan.theatre.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TheatreOwnerRequestRepository extends JpaRepository<TheatreOwnerRequest, Long> {

    Optional<TheatreOwnerRequest> findByUserIdAndStatus(
            Long userId,
            RequestStatus status
    );

    List<TheatreOwnerRequest> findByStatus(RequestStatus status);
}