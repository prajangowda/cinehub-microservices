package com.prajan.gateway.util;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;


@Component
public class JwtUtil {


    @Value(value = "${jwt.secretKey}")
    private String jwtSecretKey;

    private SecretKey key()
    {
        return Keys.hmacShaKeyFor(jwtSecretKey.getBytes(StandardCharsets.UTF_8));
    }


    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();

    }

    public boolean isValid(String token){

        try{
            Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parseSignedClaims(token);
            return true;
        }catch(Exception e){
            return false;
        }

    }




}
