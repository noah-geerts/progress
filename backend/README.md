# Progress Backend

Note: all instructions and commands below assume a Windows development environment with PowerShell commands.

## Quick Start

1. Ensure you have Java, Maven, and Docker installed
2. Ensure Docker is running
3. Run `docker-compose up -d` to spin up an instance of a PostgreSQL container
4. Run `$env:SPRING_PROFILES_ACTIVE = "dev"` to ensure spring boot loads `application-dev.properties`
5. Run `mvn spring-boot:run` to start the Spring Boot REST API

## Environment Variables

These are for production only. For development, we hardcode the values in `application-dev.properties`. These can be changed if you would like to use different ports or modify the development PostgreSQL server configuration in `docker-compose.yml`.

- AUTH_RESOURCE_SERVER: the URL of the auth resource server at which to fetch the public key to verify JWTs
- PORT: the port to expose the REST API on
- DB_URL: the URL of the Postgre DB
- DB_USER: the username for DB login
- DB_PASSWORD: the password for DB login

## API Reference

[Find here](./API%20Reference.md)
