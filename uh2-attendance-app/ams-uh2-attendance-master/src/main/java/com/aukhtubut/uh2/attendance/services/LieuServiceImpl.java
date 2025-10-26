package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.LieuDtoExt;
import com.aukhtubut.uh2.attendance.dtos.LieuDtoExtArray;
import io.netty.resolver.DefaultAddressResolverGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
@Service
public class LieuServiceImpl implements LieuService {
    @Value("${platform.rest.data.lieu}")
    private String resourceRestUrl;

    @Value("${platform.rest.data.lieu.fields}")
    private String resourceFields;
    @Autowired
    AuthService authService;
    @Override
    public LieuDtoExtArray getLieu() {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        return client.get()
                .uri("?fields={fields}", resourceFields)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .bodyToMono(LieuDtoExtArray.class).block();
    }

    @Override
    public LieuDtoExt getLieuByNom(String name) {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .baseUrl(resourceRestUrl)
                .build();
        return client.get()
                .uri("/{nom}", name)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .onStatus(status -> status.is4xxClientError(), response -> {
                    if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
                        return Mono.empty();
                    }
                    return response.createException()
                            .flatMap(Mono::error);
                })
                .bodyToMono(LieuDtoExt.class)
                .blockOptional() // Use blockOptional instead of block to handle empty Monos
                .orElse(null);
    }
}
