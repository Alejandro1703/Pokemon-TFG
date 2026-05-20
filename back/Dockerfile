# Paso 1: Compilar la aplicación con Maven y Java 17 (Usando Temurin)
FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN ./mvnw clean package -DskipTests

# Paso 2: Ejecutar la aplicación (Usando la imagen oficial de Eclipse Temurin)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
COPY --from=build /app/target/pokemon-tfg-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 9876
ENTRYPOINT ["java", "-jar", "app.jar"]