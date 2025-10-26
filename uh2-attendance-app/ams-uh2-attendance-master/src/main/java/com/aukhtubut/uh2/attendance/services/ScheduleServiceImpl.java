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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class ScheduleServiceImpl implements ScheduleService {

	@Value("${platform.rest.data.schedule}")
	private String resourceRestUrl;


	@Value("${platform.rest.data.pointage}")
	private String resourceRestUrlPointage;

	@Value("${platform.rest.data.schedule.fields}")
	private String resourceFields;


	@Autowired
	AuthService authService;

	@Override
	public ScheduleDtoExtArray getSchedules() {

		HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

		WebClient client = WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(httpClient))
				.baseUrl(resourceRestUrl)
				.build();


		return client.get()
				.uri("?fields={fields}", resourceFields)
				.headers(h -> h.setBearerAuth(authService.getAccessToken()))
				.retrieve()
				.bodyToMono(ScheduleDtoExtArray.class).block();

	}

	@Override
	public PointageDtoExt markPresence(String student, String schedule) {

		PointageDto toPost = PointageDto.builder()
				.schedule(schedule)
				.etudiant(student)
				.date_effet(LocalDateTime.now()
						.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
				.status("Present").build();

		HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

		WebClient client = WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(httpClient))
				.baseUrl(resourceRestUrlPointage)
				.build();

		return client.post()
				.uri("") // Endpoint to which you are posting
				.headers(h -> h.setBearerAuth(authService.getAccessToken()))
				.body(Mono.just(toPost), PointageDto.class) // Sending studentDto as the body
				.retrieve()
				.onStatus(status -> status.is4xxClientError(), response -> {
					if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
						// Handle 404 specifically
						return Mono.empty(); // Return an empty Mono for 404 error
					}
					if (response.statusCode().equals(HttpStatus.CONFLICT)) {
						// Handle 409 specifically
						return Mono.empty(); // Return an empty Mono for 409 error
					}
					// For other 4xx errors, you can either return empty Mono or propagate an error
					return response.createException().flatMap(Mono::error);
				})
				.bodyToMono(PointageDtoExt.class) // Expected response type
				.blockOptional()
				.orElse(null);
	}

    @Override
    public ScheduleDtoExt getScheduleByName(String name) {
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
                .bodyToMono(ScheduleDtoExt.class)
                .blockOptional() // Use blockOptional instead of block to handle empty Monos
                .orElse(null);
    }

//    @Override
//    public ScheduleDtoExt createSchedule(ScheduleDto schedule) {
//        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);
//
//        WebClient client = WebClient.builder()
//                .clientConnector(new ReactorClientHttpConnector(httpClient))
//				.defaultHeader(HttpHeaders.EXPECT, "")
//                .baseUrl(resourceRestUrl)
//                .build();
//
//        return client.post()
//                .headers(h -> h.setBearerAuth(authService.getAccessToken()))
//                .body(Mono.just(schedule), CalendrierDto.class)
//                .retrieve()
//                .bodyToMono(ScheduleDtoExt.class)
//                .block();
//    }
@Override
public ScheduleDtoExt createSchedule(ScheduleDto schedule) {
	HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

	WebClient client = WebClient.builder()
			.clientConnector(new ReactorClientHttpConnector(httpClient))
			.defaultHeader(HttpHeaders.EXPECT, "")
			.baseUrl(resourceRestUrl)
			.build();

	return client.post()
			.headers(h -> h.setBearerAuth(authService.getAccessToken()))
			.body(Mono.just(schedule), CalendrierDto.class)
			.retrieve()
			.bodyToMono(ScheduleDtoExt.class)
			.block();
}

    @Override
    public ScheduleDtoExt updateSchedule(ScheduleDto schedule, String name) {
        HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
				.defaultHeader(HttpHeaders.EXPECT, "")
                .baseUrl(resourceRestUrl)
                .build();
        ScheduleDtoExt existingSchedule = client.get()
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
                .bodyToMono(ScheduleDtoExt.class)
                .blockOptional()
                .orElse(null);

        if (existingSchedule != null) {
            return client.put()
                    .uri("/{name}", name)
                    .headers(h -> h.setBearerAuth(authService.getAccessToken()))
                    .body(Mono.just(schedule), ScheduleDto.class)
                    .retrieve()
                    .bodyToMono(ScheduleDtoExt.class)
                    .block();
        } else {
            return null;
        }
    }

	@Override
	public void deleteSchedule(String name) {
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
class SNotFoundException extends RuntimeException {
	public SNotFoundException(String message) {
		super(message);
	}
}
