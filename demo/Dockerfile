# Dùng hình ảnh JDK chính thức để build
FROM maven:3.9.5-eclipse-temurin-17 AS build

# Tạo thư mục để chứa mã nguồn
WORKDIR /app

# Copy file cấu hình và mã nguồn vào container
COPY pom.xml .
COPY src ./src

# Build project
RUN mvn clean package -DskipTests

# Dùng JRE nhẹ hơn để chạy
FROM eclipse-temurin:17-jre

# Tạo thư mục app
WORKDIR /app

# Copy file JAR đã build từ stage trước
COPY --from=build /app/target/demo-1.0-SNAPSHOT.jar app.jar

# Cấu hình cổng
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
