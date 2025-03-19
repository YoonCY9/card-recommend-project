package card_recommend_project.card_recommend_project.google;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final OAuth2UserService userService;

    public SecurityConfig(OAuth2UserService userService) {
        this.userService = userService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf((csrf) -> csrf.disable())

                .formLogin((login) -> login.disable())

                .httpBasic((basic) -> basic.disable())

                .oauth2Login((oaut2) -> oaut2
                        .userInfoEndpoint(userInfoEndpointConfig ->
                                userInfoEndpointConfig.userService(userService))
                                .successHandler(new CustomAuthenticationSuccessHandler())
                        );

        http
                .authorizeHttpRequests((auth) -> auth
                        .anyRequest().permitAll() // 모든 요청 허용
                );

        // 스프링 시큐리티 시용중 h2 console로 접근하기 위한 코드
        http.headers(httpSecurityHeadersConfigurer -> httpSecurityHeadersConfigurer.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

        return http.build();
    }
}

