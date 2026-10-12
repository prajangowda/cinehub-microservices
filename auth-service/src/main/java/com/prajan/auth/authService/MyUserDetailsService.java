package com.prajan.auth.authService;


import com.prajan.auth.model.CustomUserDetails;
import com.prajan.auth.model.UserIn;
import com.prajan.auth.repository.UserInRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {
    private final UserInRepository userrepo;

    public MyUserDetailsService(UserInRepository userrepo) {
        this.userrepo = userrepo;
    }
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserIn user=userrepo.findByEmail(email).orElse(null);

        if(user==null)
        {
            throw new UsernameNotFoundException("user not found");
        }
        return new CustomUserDetails(user);
    }
}
