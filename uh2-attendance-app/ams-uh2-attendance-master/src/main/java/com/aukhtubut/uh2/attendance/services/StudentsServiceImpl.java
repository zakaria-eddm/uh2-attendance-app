package com.aukhtubut.uh2.attendance.services;

import com.aukhtubut.uh2.attendance.dtos.*;
import com.google.zxing.NotFoundException;
import io.netty.resolver.DefaultAddressResolverGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

@Service
public class StudentsServiceImpl implements StudentsService {

	@Value("${platform.rest.data.student}")
	private String resourceRestUrl;

	@Value("${platform.rest.data.student.fields}")
	private String resourceFields;
	@Autowired
	AuthService authService;

	@Override
	public StudentDtoExtArray getStudents() {

		HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

		WebClient client = WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(httpClient))
				.baseUrl(resourceRestUrl)
				.build();


		return client.get()
				.uri("?fields={fields}", resourceFields)
				.headers(h -> h.setBearerAuth(authService.getAccessToken()))
				.retrieve()
				.bodyToMono(StudentDtoExtArray.class).block();

	}

	@Override
	public StudentDtoExt getStudentsByCne(String cne) {
		HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

		WebClient client = WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(httpClient))
				.baseUrl(resourceRestUrl)
				.build();


		return client.get()
				.uri("/{cne}", cne)
				.headers(h -> h.setBearerAuth(authService.getAccessToken()))
				.retrieve()
				.onStatus(status -> status.is4xxClientError(), response -> {
					if (response.statusCode().equals(HttpStatus.NOT_FOUND)) {
						return Mono.empty();
					}
					return response.createException()
							.flatMap(Mono::error);
				})
				.bodyToMono(StudentDtoExt.class)
				.blockOptional() // Use blockOptional instead of block to handle empty Monos
				.orElse(null);
	}



	@Override
	public StudentDtoExt createStudent(StudentDto student) {
		HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

		WebClient client = WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(httpClient))
				.defaultHeader(HttpHeaders.EXPECT, "")
				.baseUrl(resourceRestUrl)
				.build();

		return client.post()
				.headers(h -> h.setBearerAuth(authService.getAccessToken()))
				.body(Mono.just(student), CalendrierDto.class)
				.retrieve()
				.bodyToMono(StudentDtoExt.class)
				.block();
	}

	@Override
	public StudentDtoExt updateStudent(StudentDto student, String name) {
		HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

		WebClient client = WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(httpClient))
				.defaultHeader(HttpHeaders.EXPECT, "")
				.baseUrl(resourceRestUrl)
				.build();
		StudentDtoExt existingStudent = client.get()
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
				.bodyToMono(StudentDtoExt.class)
				.blockOptional()
				.orElse(null);

		if (existingStudent != null) {
			return client.put()
					.uri("/{name}", name)
					.headers(h -> h.setBearerAuth(authService.getAccessToken()))
					.body(Mono.just(student), StudentDto.class)
					.retrieve()
					.bodyToMono(StudentDtoExt.class)
					.block();
		} else {
			return null;
		}
	}

	@Override
	public void deleteStudent(String cne) {
		HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

		WebClient client = WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(httpClient))
				.baseUrl(resourceRestUrl)
				.build();

		client.delete()
				.uri("/{cne}", cne)
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

class SpNotFoundException extends RuntimeException {
	public SpNotFoundException(String message) {
		super(message);
	}
}

