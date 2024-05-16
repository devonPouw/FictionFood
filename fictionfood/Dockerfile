FROM gradle:8.7.0-jdk21-alpine AS build
WORKDIR /app

COPY build.gradle.kts settings.gradle.kts ./
COPY gradle ./gradle
COPY src ./src

RUN gradle build --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
ENV APP_HOME=/app

COPY --from=build ${APP_HOME}/build/libs/*.jar app.jar

COPY src/*.jpg src/

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.jar"]
