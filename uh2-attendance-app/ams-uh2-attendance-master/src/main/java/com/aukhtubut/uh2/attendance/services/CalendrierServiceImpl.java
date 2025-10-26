package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.CalendrierDto;
import com.aukhtubut.uh2.attendance.dtos.CalendrierDtoExt;
import com.aukhtubut.uh2.attendance.dtos.CalendrierDtoExtArray;
import io.netty.resolver.DefaultAddressResolverGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

@Service
public class CalendrierServiceImpl implements CalendrierService {

    @Value("${platform.rest.data.calendrier}")
    private String resourceRestUrl;

    @Value("${platform.rest.data.calendrier.fields}")
    private String resourceFields;

    @Autowired
    AuthService authService;

    private WebClient createWebClient() {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);
        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader(HttpHeaders.EXPECT, "") // Désactiver l'en-tête Expect
                .baseUrl(resourceRestUrl)
                .build();
    }

    @Override
    public CalendrierDtoExtArray getCalendriers() {
        WebClient client = createWebClient();
        return client.get()
                .uri("?fields={fields}", resourceFields)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
                .bodyToMono(CalendrierDtoExtArray.class).block();
    }

    @Override
    public CalendrierDtoExt getCalendrierById(String name) {
        WebClient client = createWebClient();
        return client.get()
                .uri("/{name}", name)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
//                .onStatus(HttpStatus::is4xxClientError, response -> {
//                    if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
//                        return Mono.empty();
//                    }
//                    return response.createException().flatMap(Mono::error);
//                })
                .bodyToMono(CalendrierDtoExt.class)
                .blockOptional()
                .orElse(null);
    }

    @Override
//    public CalendrierDtoExt createCalendrier(String name, String reference_doctype, String subject_field, String start_date_field, String end_date_field) {
    public CalendrierDtoExt createCalendrier(CalendrierDto calendrier) {
//        CalendrierDto ToPost = CalendrierDto.builder()
//                .name(name)
//                .reference_doctype(reference_doctype)
//                .subject_field(subject_field)
//                .start_date_field(start_date_field)
//                .end_date_field(end_date_field)
//                .build();

        WebClient client = createWebClient();
        return client.post()
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .body(Mono.just(calendrier), CalendrierDto.class)
                .retrieve()
                .bodyToMono(CalendrierDtoExt.class)
                .block();
    }

    @Override
//    public CalendrierDtoExt updateCalendrier(String name, String reference_doctype, String subject_field, String start_date_field, String end_date_field, String nom) {
    public CalendrierDtoExt updateCalendrier(CalendrierDto calendrier, String name) {
//        CalendrierDto ToPost = CalendrierDto.builder()
//                .name(name)
//                .reference_doctype(reference_doctype)
//                .subject_field(subject_field)
//                .start_date_field(start_date_field)
//                .end_date_field(end_date_field)
//                .build();

        WebClient client = createWebClient();
        CalendrierDtoExt existingCalendrier = client.get()
                .uri("/{name}", name)
                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                .retrieve()
//                .onStatus(HttpStatus::is4xxClientError, response -> {
//                    if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
//                        return Mono.empty();
//                    }
//                    return response.createException().flatMap(Mono::error);
//                })
                .bodyToMono(CalendrierDtoExt.class)
                .blockOptional()
                .orElse(null);

        if (existingCalendrier != null) {
            // Le calendrier existe, donc nous pouvons le mettre à jour
            return client.put()
                    .uri("/{name}", name)
                    .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                    .body(Mono.just(calendrier), CalendrierDto.class)
                    .retrieve()
                    .bodyToMono(CalendrierDtoExt.class)
                    .block();
        } else {
            return null;
        }
    }

    @Override
    public void deleteCalendrier(String name) {
        WebClient client = createWebClient();
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

















//@Service
//public class CalendrierServiceImpl implements CalendrierService {
//    @Value("${platform.rest.data.calendrier}")
//    private String resourceRestUrl;
//
//    @Value("${platform.rest.data.calendrier.fields}")
//    private String resourceFields;
//    @Autowired
//    AuthService authService;
//    @Override
//    public CalendrierDtoExtArray getCalendriers() {
//        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);
//
//        WebClient client = WebClient.builder()
//                .clientConnector(new ReactorClientHttpConnector(httpClient))
//                .baseUrl(resourceRestUrl)
//                .build();
//        return client.get()
//                .uri("?fields={fields}", resourceFields)
//                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
//                .retrieve()
//                .bodyToMono(CalendrierDtoExtArray.class).block();
//    }
//
//    @Override
//    public CalendrierDtoExt getCalendrierById(String name) {
//        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);
//
//        WebClient client = WebClient.builder()
//                .clientConnector(new ReactorClientHttpConnector(httpClient))
//                .baseUrl(resourceRestUrl)
//                .build();
//        return client.get()
//                .uri("/{name}", name)
//                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
//                .retrieve()
//                .onStatus(status -> status.is4xxClientError(), response -> {
//                    if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
//                        return Mono.empty();
//                    }
//                    return response.createException()
//                            .flatMap(Mono::error);
//                })
//                .bodyToMono(CalendrierDtoExt.class)
//                .blockOptional() // Use blockOptional instead of block to handle empty Monos
//                .orElse(null);
//    }
//
//    @Override
//
//  public CalendrierDtoExt createCalendrier(CalendrierDto calendrier) {
// //   public CalendrierDtoExt createCalendrier(String name,String reference_doctype, String subject_field,String start_date_field,String end_date_field) {
//
//
//        CalendrierDto ToPost = CalendrierDto.builder().name(name).reference_doctype(reference_doctype)
//                .subject_field(subject_field).start_date_field(start_date_field).end_date_field(end_date_field)
//                .build();
//
//        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);
//
//        WebClient client = WebClient.builder()
//                .clientConnector(new ReactorClientHttpConnector(httpClient))
//                .baseUrl(resourceRestUrl)
//                .build();
//
//        return client.post()
//                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
//                .body(Mono.just(ToPost), CalendrierDto.class)
//                .retrieve()
//                .bodyToMono(CalendrierDtoExt.class)
//                .block();
//    }
//
////    public CalendrierDtoExt updateCalendrier(CalendrierDto calendrier, String name) {
//public CalendrierDtoExt updateCalendrier(String name,String reference_doctype, String subject_field,String start_date_field,String end_date_field,String nom) {
//
//    CalendrierDto ToPost = CalendrierDto.builder().name(name).reference_doctype(reference_doctype)
//            .subject_field(subject_field).start_date_field(start_date_field).end_date_field(end_date_field)
//            .build();
//        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);
//
//        WebClient client = WebClient.builder()
//                .clientConnector(new ReactorClientHttpConnector(httpClient))
//                .baseUrl(resourceRestUrl)
//                .build();
//        CalendrierDtoExt existingCalendrier = client.get()
//                .uri("/{nom}", nom)
//                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
//                .retrieve()
//                .onStatus(status -> status.is4xxClientError(), response -> {
//                    if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
//                        return Mono.empty();
//                    }
//                    return response.createException()
//                            .flatMap(Mono::error);
//                })
//                .bodyToMono(CalendrierDtoExt.class)
//                .blockOptional()
//                .orElse(null);
//
//        if (existingCalendrier != null) {
//            // Le calendrier existe, donc nous pouvons le mettre à jour
//            return client.put()
//                    .uri("/{nom}", nom)
//                    .headers(h -> h.setBearerAuth(authService.getAccessToken()))
//                    .body(Mono.just(ToPost), CalendrierDto.class)
//                    .retrieve()
//                    .bodyToMono(CalendrierDtoExt.class)
//                    .block();
//        } else {
//            return null;
//        }
//    }
//
//
//}
