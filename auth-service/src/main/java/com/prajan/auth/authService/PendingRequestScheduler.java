package com.prajan.auth.authService;

import com.prajan.auth.repository.PendingRegistrationRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class PendingRequestScheduler {

    private final PendingRegistrationRepository pendingRepository;

    @Transactional
    @Scheduled(fixedRate = 60000) // runs every 1 minute
    public void deleteExpiredRequests() {

        LocalDateTime expiryTime = LocalDateTime.now().minusMinutes(5);

        pendingRepository.deleteByCreatedAtBefore(expiryTime);

        System.out.println("Expired pending requests deleted.");
    }
}
