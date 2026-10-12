package com.prajan.theatre.service;


import com.prajan.common.enums.Role;
import com.prajan.theatre.client.AuthClient;
import com.prajan.theatre.dto.TheatreOwnerRequestDto;
import com.prajan.theatre.dto.TheatreOwnerResponseDto;
import com.prajan.theatre.dto.UserResponse;
import com.prajan.theatre.entity.TheatreOwnerRequest;
import com.prajan.theatre.enums.RequestStatus;
import com.prajan.theatre.repository.TheatreOwnerRequestRepository;
import com.prajan.theatre.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class TheatreOwnerRequestService {

    private final TheatreOwnerRequestRepository requestRepository;
    private final CurrentUserService currentUserService;
    private final AuthClient authClient;

    public TheatreOwnerResponseDto submitRequest(

            TheatreOwnerRequestDto dto
    ) {
        Long userId = currentUserService.getUserId();

        UserResponse user = authClient.getUser(userId);
        log.info("User details: {}", user);

        requestRepository.findByUserIdAndStatus(userId, RequestStatus.PENDING)
                .ifPresent(r -> {
                    throw new RuntimeException(
                            "Pending request already exists");
                });


        TheatreOwnerRequest request = TheatreOwnerRequest.builder()
                .userId(userId)
                .businessName(dto.getBusinessName())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .gstNumber(dto.getGstNumber())
                .status(RequestStatus.PENDING)
                .requestedAt(LocalDateTime.now()

                )
                .build();

        requestRepository.save(request);

        return TheatreOwnerResponseDto.builder()
                .id(request.getId())
                .businessName(request.getBusinessName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .gstNumber(request.getGstNumber())
                .status(request.getStatus())
                .requestedAt(request.getRequestedAt())
                .build();
    }


    public List<TheatreOwnerResponseDto> getPendingRequests() {

        return requestRepository.findByStatus(RequestStatus.PENDING)
                .stream()
                .map(r -> TheatreOwnerResponseDto.builder()
                        .id(r.getId())
                        .businessName(r.getBusinessName())
                        .phone(r.getPhone())
                        .address(r.getAddress())
                        .gstNumber(r.getGstNumber())
                        .status(r.getStatus())
                        .requestedAt(r.getRequestedAt())
                        .build())
                .toList();
    }


    public void approve(Long requestId) {

        TheatreOwnerRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow();



        authClient.changeRole(
                request.getUserId(),
                Role.THEATRE_OWNER
        );

        request.setStatus(RequestStatus.APPROVED);
        requestRepository.save(request);
    }


    public void reject(Long requestId) {

        TheatreOwnerRequest request =
                requestRepository.findById(requestId)
                        .orElseThrow();

        request.setStatus(RequestStatus.REJECTED);

        requestRepository.save(request);
    }
}
