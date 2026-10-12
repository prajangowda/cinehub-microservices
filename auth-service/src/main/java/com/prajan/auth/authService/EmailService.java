
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

    public EmailService(
            @Value("${RESEND_API_KEY}") String apiKey
    ) {
        this.resend = new Resend(apiKey);
    }

    public void sendOtp(String to, String otp) {
        log.info("in the email service ");
        SendEmailRequest request = SendEmailRequest.builder()
                .from("onboarding@resend.dev")
                .to(to)
                .subject("Your CineHub OTP")
                .html("""
                        <h2>CineHub Email Verification</h2>
                        <p>Your OTP is:</p>
                        <h1>%s</h1>
                        <p>This OTP is valid for 5 minutes.</p>
                        """.formatted(otp))
                .build();

        SendEmailResponse response = resend.emails().send(request);

        System.out.println("Email sent: " + response.getId());
    }
}
