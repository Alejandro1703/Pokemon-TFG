# Paso 1: Compilar la aplicación con Maven y Java 17
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Paso 2: Ejecutar la aplicación
FROM openjdk:17-jdk-slim
COPY --from=build /target/pokemon-tfg-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9876
ENTRYPOINT ["java", "-jar", "app.jar"]