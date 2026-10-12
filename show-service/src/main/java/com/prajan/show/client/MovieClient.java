package com.prajan.show.client;

import com.prajan.common.dto.MovieIdNameResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(name = "movie-service")
public interface MovieClient {

    @GetMapping("/api/v1/public/internal/movies/{id}")
    MovieIdNameResponse getMovieById(@PathVariable("id") Long id);

    @PostMapping("/api/v1/public/internal/movies/")
    List<MovieIdNameResponse> getMoviesByIds(@RequestBody List<Long> ids);
}