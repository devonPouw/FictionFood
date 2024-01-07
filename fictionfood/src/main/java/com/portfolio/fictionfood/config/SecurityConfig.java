package com.portfolio.fictionfood.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
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

import static com.portfolio.fictionfood.user.UserRole.CHEF;
import static com.portfolio.fictionfood.user.UserRole.MODERATOR;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] allUsers = new String[]{CHEF.name(), MODERATOR.name()};

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;
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
            matchAll.apply(auth).apply("/api/auth/**").permitAll();
            match.apply(auth).apply("api/recipes", POST).hasAnyRole(allUsers);
            match.apply(auth).apply("api/recipes/*", GET).permitAll();
            auth.anyRequest().authenticated();
        });
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        http.exceptionHandling(e -> e.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
        http.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider);
        http.logout(logout ->
                logout.logoutUrl("/api/auth/logout")
                        .addLogoutHandler(logoutHandler)
                        .logoutSuccessHandler((request, response, authentication) -> SecurityContextHolder.clearContext())
        );
        return http.build();
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
