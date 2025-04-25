# Use Java 17 base image
FROM eclipse-temurin:17-jdk

# Set working directory inside the container
WORKDIR /app

# Copy your entire project into the container
COPY . .

# Build the Spring Boot app using Maven Wrapper (skips tests)
RUN ./mvnw clean package -DskipTests

# Run the built JAR file
CMD ["java", "-jar", "target/Gamified-0.0.1-SNAPSHOT.jar"]
