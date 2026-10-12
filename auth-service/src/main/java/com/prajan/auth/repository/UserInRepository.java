package com.prajan.auth.repository;


import com.prajan.auth.enums.provider;
import com.prajan.auth.model.UserIn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserInRepository extends JpaRepository<UserIn, Long> {
    Optional<UserIn> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<UserIn> findByProviderIdAndProvider(String providerId, provider providerType);
}