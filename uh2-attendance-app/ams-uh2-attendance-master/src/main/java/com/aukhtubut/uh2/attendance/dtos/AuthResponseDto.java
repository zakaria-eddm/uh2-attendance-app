package com.aukhtubut.uh2.attendance.dtos;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter @NoArgsConstructor
public class AuthResponseDto {

	private String access_token;
	private String expires_in;
	private String token_type;
	private String scope;
	private String refresh_token;

}
