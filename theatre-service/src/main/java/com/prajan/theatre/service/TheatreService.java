package com.prajan.theatre.service;

import com.prajan.common.enums.Role;
import com.prajan.theatre.error.*;
import com.prajan.theatre.dto.CreateTheatreRequest;
import com.prajan.theatre.dto.TheatreResponse;
import com.prajan.theatre.dto.UpdateTheatreRequest;
import com.prajan.theatre.entity.Theatre;
import com.prajan.theatre.mapper.TheatreMapper;
import com.prajan.theatre.repository.TheatreRepository;
import com.prajan.theatre.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.access.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class  TheatreService {

    private final TheatreRepository theatreRepository;
    private final CurrentUserService currentUser;


    public TheatreResponse createTheatre(CreateTheatreRequest request) {

        if (theatreRepository.existsByEmail(request.getEmail())) {
            throw new ResourceAlreadyExistsException("Email already exists");
        }


        if (!currentUser.hasRole(Role.THEATRE_OWNER)) {
            throw new AccessDeniedException(
                    "Only theatre owners can create theatres"
            );
        }

        Long userId = currentUser.getUserId();

        Theatre theatre = Theatre.builder()
                .name(request.getName())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .phone(request.getPhone())
                .email(request.getEmail())
                .active(true)
                .ownerId(userId)
                .build();

        theatreRepository.save(theatre);

        log.info("Theatre created with ID: {}", theatre.getId());
        return TheatreMapper.toResponse(theatre);
    }


    public TheatreResponse getTheatre(Long theatreId) {

        Theatre theatre = theatreRepository.findById(theatreId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found"));

        log.info("Theatre retrieved with ID: {}", theatre.getId());
        return TheatreMapper.toResponse(theatre);
    }


    public List<TheatreResponse> getAllTheatres() {

        return theatreRepository.findAll()
                .stream()
                .map(TheatreMapper::toResponse)
                .toList();
    }


    public void deleteTheatre(Long theatreId) {

        Theatre theatre = theatreRepository.findById(theatreId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found"));

        theatre.setActive(false);

        log.info("Theatre deactivated with ID: {}", theatre.getId());
        theatreRepository.save(theatre);
    }


    public TheatreResponse updateTheatre(Long theatreId,
                                         UpdateTheatreRequest request) {

        Theatre theatre = theatreRepository.findById(theatreId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Theatre not found"));

        if (request.getName() != null)
            theatre.setName(request.getName());

        if (request.getAddress() != null)
            theatre.setAddress(request.getAddress());

        if (request.getCity() != null)
            theatre.setCity(request.getCity());

        if (request.getState() != null)
            theatre.setState(request.getState());

        if (request.getPincode() != null)
            theatre.setPincode(request.getPincode());

        if (request.getLatitude() != null)
            theatre.setLatitude(request.getLatitude());

        if (request.getLongitude() != null)
            theatre.setLongitude(request.getLongitude());

        if (request.getPhone() != null)
            theatre.setPhone(request.getPhone());

        if (request.getEmail() != null)
            theatre.setEmail(request.getEmail());

        if (request.getActive() != null)
            theatre.setActive(request.getActive());

        theatreRepository.save(theatre);

        return TheatreMapper.toResponse(theatre);
    }


    public List<TheatreResponse> getTheatresByCity(String city) {

        return theatreRepository.findByCityIgnoreCase(city)
                .stream()
                .map(TheatreMapper::toResponse)
                .toList();
    }


    public List<TheatreResponse> getActiveTheatres() {

        return theatreRepository.findByActiveTrue()
                .stream()
                .map(TheatreMapper::toResponse)
                .toList();
    }
}