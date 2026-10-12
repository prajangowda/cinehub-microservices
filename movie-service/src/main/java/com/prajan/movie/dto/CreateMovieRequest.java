package com.prajan.movie.dto;

import com.prajan.movie.enums.Certificate;
import com.prajan.movie.enums.Genre;
import com.prajan.movie.enums.Language;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateMovieRequest {

    private String title;

    private String description;

    private Integer duration;

    private Genre genre;

    private Language language;

    private Certificate certificate;

    private LocalDate releaseDate;

    private String posterUrl;

    private Double imdbRating;
}