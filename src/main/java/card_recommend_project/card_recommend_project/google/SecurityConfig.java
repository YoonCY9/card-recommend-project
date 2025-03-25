package card_recommend_project.card_recommend_project.google;

import card_recommend_project.card_recommend_project.loginUtils.JwtProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final OAuth2UserService userService;
    private final JwtProvider jwtProvider;
    private final CustomSuccessHandler customSuccessHandler;

    public SecurityConfig(OAuth2UserService userService, JwtProvider jwtProvider, CustomSuccessHandler customSuccessHandler) {
        this.userService = userService;
        this.jwtProvider = jwtProvider;
        this.customSuccessHandler = customSuccessHandler;
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
                                .successHandler(customSuccessHandler)
                        );

        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/api/user/**").authenticated()
                        .anyRequest().permitAll() // 모든 요청 허용
                );

        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 스프링 시큐리티 시용중 h2 console로 접근하기 위한 코드
        http.headers(httpSecurityHeadersConfigurer -> httpSecurityHeadersConfigurer.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));

        return http.build();
    }
}

