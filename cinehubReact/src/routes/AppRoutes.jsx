import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import ErrorPage from '../pages/ErrorPage.jsx';
import SeatSelectionPage from '../pages/SeatSelectionPage.jsx';
import BookingSummaryPage from '../pages/BookingSummaryPage.jsx';
import { ProtectedRoute, GuestRoute, AdminRoute, OwnerRoute } from '../components/ProtectedRoute.jsx';

const HomePage = lazy(() => import('../pages/HomePage.jsx'));
const MoviesPage = lazy(() => import('../pages/MoviesPage.jsx'));
const LoginPage = lazy(() => import('../pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/RegisterPage.jsx'));
const VerifyOtpPage = lazy(() => import('../pages/VerifyOtpPage.jsx'));
const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage.jsx'));
const TheatreDashboardPage = lazy(() => import('../pages/TheatreDashboardPage.jsx'));
const ProfilePage = lazy(() => import('../pages/ProfilePage.jsx'));
const RequestTheatrePage = lazy(() => import('../pages/RequestTheatrePage.jsx'));
const MovieDetailsPage = lazy(() => import('../pages/MovieDetailsPage.jsx'));
const BookingSuccessPage = lazy(() => import('../pages/BookingSuccessPage.jsx'));
const MyBookingsPage = lazy(() => import('../pages/MyBookingsPage.jsx'));

function AppRoutes() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl p-8 text-center text-white">Loading...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />} />
          <Route path="/show/:showId/seats" element={<SeatSelectionPage />} />
          <Route path="/booking-summary" element={<BookingSummaryPage />} />
          <Route path="/booking-success" element={<BookingSuccessPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/owner/request" element={<ProtectedRoute><RequestTheatrePage /></ProtectedRoute>} />
          <Route path="/theatres" element={<OwnerRoute><TheatreDashboardPage /></OwnerRoute>} />
          
          <Route path="" element={<NotFoundPage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/verify-otp" element={<GuestRoute><VerifyOtpPage /></GuestRoute>} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
        </Route>

        <Route path="/error" element={<ErrorPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />

      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
