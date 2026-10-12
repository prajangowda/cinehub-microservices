package com.prajan.movie.controller;


import com.prajan.common.dto.MovieIdNameResponse;
import com.prajan.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/public/internal")
@RequiredArgsConstructor
public class InternalMovieController {

    private final MovieService movieService;

    @GetMapping("/movies/{id}")
    public MovieIdNameResponse getMovieById(@PathVariable Long id) {
        return movieService.getMovieIdName(id);
    }

    @PostMapping("/movies/")
    public List<MovieIdNameResponse> getMoviesByIds(@RequestBody List<Long> ids) {
        return movieService.getMoviesIdNameByIds(ids);
    }
}
