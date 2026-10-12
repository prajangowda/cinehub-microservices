package com.prajan.show.mapper;

import com.prajan.common.dto.MovieIdNameResponse;
import com.prajan.common.dto.ScreenIdNameResponse;
import com.prajan.show.dto.ShowResponse;
import com.prajan.show.entity.Show;


public class ShowMapper {

    public static ShowResponse toResponse(Show show, MovieIdNameResponse movie, ScreenIdNameResponse screen) {


        return ShowResponse.builder()
                .id(show.getId())

                .movieId(movie.id())
                .movieTitle(movie.title())

                .screenId(screen.id())
                .screenName(screen.name())

                .theatreId(screen.theatreId())
                .theatreName(screen.theatreName())

                .showDate(show.getShowDate())
                .startTime(show.getStartTime())
                .endTime(show.getEndTime())

                .status(show.getStatus())
                .active(show.getActive())

                .build();
    }
}