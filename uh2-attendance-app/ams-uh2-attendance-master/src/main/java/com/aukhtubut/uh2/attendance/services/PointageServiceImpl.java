package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.aukhtubut.uh2.attendance.dtos.PointageDtoExt;
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

@Service
public class PointageServiceImpl implements PointageService {
    @Value("${platform.rest.data.pointage}")
    private String resourceRestUrl;

    @Value("${platform.rest.data.pointage.fields}")
    private String resourceFields;
    @Autowired
    AuthService authService;

    @Override
    public PointageDtoExtArray getPointages() {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        return client.get()
                .uri("?fields={fields}", resourceFields)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .bodyToMono(PointageDtoExtArray.class).block();
    }



    @Override
    public PointageDtoExt getPointageByName(String name) {
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
                .bodyToMono(PointageDtoExt.class)
                .blockOptional() // Use blockOptional instead of block to handle empty Monos
                .orElse(null);
    }

    @Override
    public PointageDtoExt updatePointage(PointageDto pointage, String name) {
//    public PointageDtoExt updatePointage( String name,String schedule,String etudiant,String date_effet, String status, String nom) {

//        PointageDto ToPost = PointageDto.builder().name(name).schedule(schedule).etudiant(etudiant)
//                .date_effet(date_effet).status(status)
//                .build();
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        PointageDtoExt existingPointage = client.get()
                .uri("/{nom}", name)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
//                .onStatus(status -> status.is4xxClientError(), response -> {
//                    if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
//                        return Mono.empty();
//                    }
//                    return response.createException()
//                            .flatMap(Mono::error);
//                })
                .bodyToMono(PointageDtoExt.class)
                .blockOptional()
                .orElse(null);

        if (existingPointage != null) {
            return client.put()
                    .uri("/{nom}", name)
                    .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                    .body(Mono.just(pointage), PointageDto.class)
                    .retrieve()
                    .bodyToMono(PointageDtoExt.class)
                    .block();
        } else {
            return null;
        }
    }

    @Override
    public PointageDtoExt CreatePointage(PointageDto pointage) {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader(HttpHeaders.EXPECT, "")
                .baseUrl(resourceRestUrl)
                .build();

        return client.post()
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .body(Mono.just(pointage), PointageDto.class)
                .retrieve()
                .bodyToMono(PointageDtoExt.class)
                .block();
    }

    @Override
    public void deletePointage(String name) {
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
