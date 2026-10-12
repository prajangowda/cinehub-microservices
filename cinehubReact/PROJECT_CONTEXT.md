# CineHub Frontend - Project Context

## Project Overview

CineHub is a movie theatre booking application.

The frontend connects to a separate Spring Boot backend.

---

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router

---

## Project Structure

The frontend is organized mainly by:

- pages
- components
- services
- hooks

Example structure:

src/
├── components/
├── pages/
├── services/
├── hooks/
├── context/
└── App.jsx

There is no strict module-based architecture.

---

## User Roles

The application supports:

- ADMIN
- THEATRE_OWNER
- CUSTOMER

---

## Theatre Owner Features

### Theatre Management

Theatre owners can:

- Create theatres
- View their theatres
- Select a theatre

### Screen Management

Theatre owners can:

- Create screens
- Select a theatre
- View screens
- Seats are generated automatically by the backend

### Show Management

Theatre owners can:

- Select a theatre
- Select a movie
- Select a screen
- Select show date
- Select start time
- Select end time
- Schedule a show

Overnight shows are supported.

Example:

22:00 → 02:00

Shows automatically become COMPLETED after their end time.

---

## Current Important Files

### Theatre Dashboard

The TheatreDashboardPage handles:

- Theatre creation
- Screen creation
- Show scheduling
- Displaying scheduled shows

It currently uses services such as:

- createTheatre
- createScreen
- createShow
- getOwnerTheatres
- getTheatreMovies
- getTheatreScreens

---

## Current Development Task

Build the customer booking flow.

Current step:

Customer selects a movie.

Frontend should call:

GET /api/v1/public/movies/{movieId}/shows

The response should display:

- Theatre name
- Screen
- Show date
- Start time
- End time

Only available scheduled shows should be displayed.

---

## Next Steps

1. Create movie browsing page.
2. Customer clicks a movie.
3. Fetch available shows for that movie.
4. Display theatres and show timings.
5. Customer selects a show.
6. Display seats.
7. Allow seat selection.
8. Create booking.
9. Handle already booked seats.

---

## Important Rules

- Do not unnecessarily restructure the existing frontend.
- Follow the existing coding style.
- Reuse existing components and services when possible.
- Backend API calls should be placed in the services folder.
- Keep pages focused on UI and user interaction.