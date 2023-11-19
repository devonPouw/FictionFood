package com.portfolio.fictionfood.config;

import com.portfolio.fictionfood.authentication.token.TokenAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import java.util.Arrays;
import java.util.List;
import java.util.function.BiFunction;
import java.util.function.Function;

import static com.portfolio.fictionfood.user.UserRole.*;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {
    static final String[] allUsers = new String[]{CHEF.name(), MODERATOR.name()};
    private final TokenAuthenticationFilter tokenAuthenticationFilter;
    Function<AuthorizeHttpRequestsConfigurer<?>.AuthorizationManagerRequestMatcherRegistry,
            BiFunction<String, HttpMethod, AuthorizeHttpRequestsConfigurer<?>.AuthorizedUrl>> match = authorization ->
            (pattern, method) -> authorization.requestMatchers(new AntPathRequestMatcher(pattern, method.name()));
    Function<AuthorizeHttpRequestsConfigurer<?>.AuthorizationManagerRequestMatcherRegistry,
            Function<String, AuthorizeHttpRequestsConfigurer<?>.AuthorizedUrl>> matchAll =
            authorization -> pattern -> authorization.requestMatchers(new AntPathRequestMatcher(pattern));

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
                                                   HandlerMappingIntrospector introspector,
                                                   @Value("${spring.h2.console.enabled}") Boolean consoleEnabled,
                                                   @Value("${spring.h2.console.path}") String h2ConsolePath)
            throws Exception {
        if (consoleEnabled) {
            var h2RequestMatcher = new MvcRequestMatcher(introspector, "/**");
            h2RequestMatcher.setServletPath(h2ConsolePath);
            http.authorizeHttpRequests((a) -> a.requestMatchers(h2RequestMatcher).permitAll());
            http.headers((headers) -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin));
            http.authorizeHttpRequests(a -> matchAll.apply(a).apply("/dev/**").permitAll());
        }
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(Customizer.withDefaults());
        http.authorizeHttpRequests((auth) -> {
            matchAll.apply(auth).apply("/auth/**").permitAll();
            auth.anyRequest().authenticated();
        });
        http.addFilterBefore(tokenAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
        http.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(@Value("${app.encrypted-password-storage}") Boolean encryptPasswords) {
        if (encryptPasswords) {
            return new BCryptPasswordEncoder();
        } else {
            return NoOpPasswordEncoder.getInstance();
        }
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(@Value("${app.cors.allowed-origins}") List<String> allowedOrigins) {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(true);
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PATCH"));
        configuration.addAllowedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}