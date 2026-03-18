# --- STAGE 1: Build Frontend ---
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
# Only copy lockfile if it exists, otherwise use package.json
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- STAGE 2: Build Backend ---
FROM maven:3.9.6-eclipse-temurin-21-alpine AS backend-build
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline
COPY src ./src
# Take built frontend assets and put them into Spring's static folder
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# --- STAGE 3: Final Runtime Image ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
# Standard cloud port
EXPOSE 8080
# Run with optimized memory for free tiers
ENTRYPOINT ["java", "-Xmx512m", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]
