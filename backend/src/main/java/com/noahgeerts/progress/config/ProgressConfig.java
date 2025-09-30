package com.noahgeerts.progress.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ProgressConfig {
  @Bean
  public ModelMapper modelMapper() {
    return new ModelMapper();
  }
}
