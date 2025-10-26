package com.aukhtubut.uh2.attendance.services;
import com.aukhtubut.uh2.attendance.dtos.*;
import io.netty.resolver.DefaultAddressResolverGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.util.Set;

@Service
public class CourServiceImpl implements CourService {
    @Value("${platform.rest.data.cour}")
    private String resourceRestUrl;

    @Value("${platform.rest.data.cour.fields}")
    private String resourceFields;
    @Autowired
    AuthService authService;
    @Override
    public CourDtoExtArray getCours() {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        return client.get()
                .uri("?fields={fields}", resourceFields)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .bodyToMono(CourDtoExtArray.class).block();
    }

    @Override
    public CourDtoExt getCoursByNom(String name) {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        return client.get()
                .uri("/{name}", name)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
                        return Mono.empty();
                    }
                    return response.createException()
                            .flatMap(Mono::error);
                })
                .bodyToMono(CourDtoExt.class)
                .blockOptional() // Use blockOptional instead of block to handle empty Monos
                .orElse(null);
    }

    @Override
    public CourDtoExt createCour(CourDto cour) {
//    public CourDtoExt createCour(String name,String ann_univ, String professor, String department) {
//        CourDto ToPost = CourDto.builder()
//                .professor(professor)
//                .name(name)
//                .ann_univ(ann_univ)
//                .department(department).build();

        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader(HttpHeaders.EXPECT, "")
                .baseUrl(resourceRestUrl)
                .build();

        return client.post()
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .body(Mono.just(cour), CourDto.class)
                .retrieve()
                .bodyToMono(CourDtoExt.class)
                .block();
    }

    @Override
    public CourDtoExt updateCour(CourDto cour, String name) {
//    public CourDtoExt updateCour(String name, String ann_univ, String professor, String department, String nom) {

//        CourDto ToPost = CourDto.builder()
//                .professor(professor)
//                .name(name)
//                .ann_univ(ann_univ)
//                .department(department)
//                .etudiants(Set<StudentsDtoExt> etudiants)

//        .build();

        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        CourDtoExt existingCour = client.get()
                .uri("/{name}", name)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
                        return Mono.empty();
                    }
                    return response.createException()
                            .flatMap(Mono::error);
                })
                .bodyToMono(CourDtoExt.class)
                .blockOptional()
                .orElse(null);

        if (existingCour != null) {
            return client.put()
                    .uri("/{name}", name)
                    .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                    .body(Mono.just(cour), CourDto.class)
                    .retrieve()
                    .bodyToMono(CourDtoExt.class)
                    .block();
        } else {
            return null;
        }
    }

    @Override
    public void deleteCour(String name) {
            HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

            WebClient client = WebClient.builder()
                    .clientConnector(new ReactorClientHttpConnector(httpClient))
                    .baseUrl(resourceRestUrl)
                    .build();

            client.delete()
                    .uri("/{name}", name)
                    .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError(), response -> {
                        if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
                            return Mono.empty();
                        }
                        return response.createException()
                                .flatMap(Mono::error);
                    })
                    .bodyToMono(Void.class)
                    .block();
    }
}
