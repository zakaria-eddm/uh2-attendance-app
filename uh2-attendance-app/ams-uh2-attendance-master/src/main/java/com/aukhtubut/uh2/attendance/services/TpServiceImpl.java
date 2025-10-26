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
@Service
public class TpServiceImpl implements TpService {
    @Value("${platform.rest.data.tp}")
    private String resourceRestUrl;

    @Value("${platform.rest.data.tp.fields}")
    private String resourceFields;
    @Autowired
    AuthService authService;
    @Override
    public TpDtoExtArray getTp() {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        return client.get()
                .uri("?fields={fields}", resourceFields)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .bodyToMono(TpDtoExtArray.class).block();
    }


    @Override
    public TpDtoExt getTpByNom(String nom) {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        return client.get()
                .uri("/{name}", nom)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
                        return Mono.empty();
                    }
                    return response.createException()
                            .flatMap(Mono::error);
                })
                .bodyToMono(TpDtoExt.class)
                .blockOptional() // Use blockOptional instead of block to handle empty Monos
                .orElse(null);
    }

    @Override
    public TpDtoExt createTp(TpDto tp) {
//    public TpDtoExt createTp(String name,String ann_univ, String professor, String department) {
//        TpDto ToPost = TpDto.builder()
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
                .body(Mono.just(tp), TpDto.class)
                .retrieve()
                .bodyToMono(TpDtoExt.class)
                .block();
    }

    @Override
    public TpDtoExt updateTp(TpDto tp, String name) {
//    public TpDtoExt updateTp(String name,String ann_univ, String professor, String department, String nom) {
//        TpDto ToPost = TpDto.builder()
//                .professor(professor)
//                .name(name)
//                .ann_univ(ann_univ)
//                .department(department).build();

        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        TpDtoExt existingTp = client.get()
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
                .bodyToMono(TpDtoExt.class)
                .blockOptional()
                .orElse(null);

        if (existingTp != null) {
            return client.put()
                    .uri("/{name}", name)
                    .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                    .body(Mono.just(tp), TpDto.class)
                    .retrieve()
                    .bodyToMono(TpDtoExt.class)
                    .block();
        } else {
            return null;
        }
    }

    @Override
    public void deleteTp(String nom) {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();

        client.delete()
                .uri("/{nom}", nom)
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
