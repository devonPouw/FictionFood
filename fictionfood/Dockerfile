FROM gradle:8.7.0-jdk21-alpine AS builder
WORKDIR /app
COPY . .
COPY gradle.properties gradle.properties
RUN gradle build

FROM eclipse-temurin:21-jre-alpine
ENV APP_HOME=/app/
COPY --from=builder ${APP_HOME}/build/libs/*.jar app.jar
RUN mkdir src
COPY src/*.jpg src/
ENTRYPOINT ["java","-jar","/app.jar"]
