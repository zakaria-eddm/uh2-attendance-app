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
public class TdServiceImpl implements TdService {
    @Value("${platform.rest.data.td}")
    private String resourceRestUrl;

    @Value("${platform.rest.data.td.fields}")
    private String resourceFields;
    @Autowired
    AuthService authService;
    @Override
    public TdDtoExtArray getTd() {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        return client.get()
                .uri("?fields={fields}", resourceFields)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .bodyToMono(TdDtoExtArray.class).block();
    }

    @Override
    public TdDtoExt getTdByNom(String nom) {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        return client.get()
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
                .bodyToMono(TdDtoExt.class)
                .blockOptional() // Use blockOptional instead of block to handle empty Monos
                .orElse(null);
    }

    @Override
    public TdDtoExt createTd(TdDto td) {
//    public TdDtoExt createTd(String name,String ann_univ, String professor, String department){
//    TdDto ToPost = TdDto.builder()
//            .professor(professor)
//            .name(name)
//            .ann_univ(ann_univ)
//            .department(department).build();
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader(HttpHeaders.EXPECT, "100-continue")
                .baseUrl(resourceRestUrl)
                .build();

        return client.post()
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .body(Mono.just(td), TdDto.class)
                .retrieve()
                .bodyToMono(TdDtoExt.class)
                .block();
    }

    @Override
    public TdDtoExt updateTd(TdDto td, String name) {
//    public TdDtoExt updateTd(String name,String ann_univ, String professor, String department, String nom){
//        TdDto ToPost = TdDto.builder()
//            .professor(professor)
//            .name(name)
//            .ann_univ(ann_univ)
//            .department(department).build();
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        TdDtoExt existingTd = client.get()
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
                .bodyToMono(TdDtoExt.class)
                .blockOptional()
                .orElse(null);

        if (existingTd != null) {
            return client.put()
                    .uri("/{name}", name)
                    .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                    .body(Mono.just(td), TdDto.class)
                    .retrieve()
                    .bodyToMono(TdDtoExt.class)
                    .block();
        } else {
            return null;
        }
    }

    @Override
    public void deleteTd(String nom) {
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
