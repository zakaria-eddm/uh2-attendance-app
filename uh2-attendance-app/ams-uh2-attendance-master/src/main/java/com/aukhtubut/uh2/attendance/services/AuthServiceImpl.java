package com.aukhtubut.uh2.attendance.services;


import com.aukhtubut.uh2.attendance.dtos.AuthResponseDto;
import io.netty.resolver.DefaultAddressResolverGroup;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Service
public class AuthServiceImpl implements AuthService {

	@Value("${platform.rest.authentication.grantType}")
	private String grantType;
	@Value("${platform.rest.authentication.clientId}")
	private String clientId;
	@Value("${platform.rest.authentication.clientSecret}")
	private String clientSecret;
	@Value("${platform.rest.authentication.username}")
	private String username;
	@Value("${platform.rest.authentication.password}")
	private String password;
	@Value("${platform.rest.authentication.authUrl}")
	private String authUrl;


	@Override
	public String getAccessToken() {
		
		MultiValueMap<String, String> bodyValues = new LinkedMultiValueMap<>();

		bodyValues.add("grant_type", grantType);
		bodyValues.add("client_id", clientId);
		bodyValues.add("client_secret", clientSecret);
		bodyValues.add("username", username);
		bodyValues.add("password", password);

		HttpClient httpClient = HttpClient.create().resolver(DefaultAddressResolverGroup.INSTANCE);

        WebClient client = WebClient.builder()
				.clientConnector(new ReactorClientHttpConnector(httpClient))
				.baseUrl(authUrl)
				.build();


		AuthResponseDto response = client.post()
				.contentType(MediaType.APPLICATION_FORM_URLENCODED)
				.accept(MediaType.APPLICATION_JSON)
				.body(BodyInserters.fromFormData(bodyValues))
				.retrieve()
				.bodyToMono(AuthResponseDto.class)
				.block();

		return response.getAccess_token();
		
	}
	

}
