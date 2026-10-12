package com.prajan.theatre.repository;

import com.prajan.theatre.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScreenRepository extends JpaRepository<Screen, Long> {
    List<Screen> findByTheatreId(Long theatreId);


}