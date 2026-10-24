
package com.prajan.auth.authService;

import com.resend.Resend;
import com.resend.services.emails.model.SendEmailRequest;
import com.resend.services.emails.model.SendEmailResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    private final Resend resend;
    private final String fromEmail;

    public EmailService(
            @Value("${resend.api-key}") String apiKey,
            @Value("${resend.from}") String fromEmail
    ) {
        this.resend = new Resend(apiKey);
        this.fromEmail = fromEmail;
    }

    public void sendOtp(String to, String otp) {

        SendEmailRequest request = SendEmailRequest.builder()
                .from(fromEmail)
                .to(to)
                .subject("Your CineHub OTP")
                .html("""
                        <h2>CineHub Email Verification</h2>
                        <p>Your OTP is:</p>
                        <h1>%s</h1>
                        <p>This OTP is valid for 5 minutes.</p>
                        <p>If you did not request this verification, please ignore this email.</p>
                        <p>Regards,<br>CineHub Team</p>
                        """.formatted(otp))
                .build();

        SendEmailResponse response = resend.emails().send(request);

        log.info("CineHub OTP email accepted by Resend. ID: {}", response.getId());
    }
}