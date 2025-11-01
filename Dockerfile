# --- Giai đoạn 1: Build (Xây dựng ứng dụng) ---
# Sử dụng image Maven chính thức để build file .jar từ mã nguồn
FROM maven:3.8.5-openjdk-17 AS build

# Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# Sao chép file pom.xml để tải các dependency trước
COPY pom.xml .
RUN mvn dependency:go-offline

# Sao chép toàn bộ mã nguồn vào container
COPY src ./src

# Chạy lệnh build của Maven để tạo ra file .jar
RUN mvn clean package -DskipTests


# --- Giai đoạn 2: Run (Chạy ứng dụng) ---
# Sử dụng một image Java runtime nhẹ hơn để chạy ứng dụng
FROM eclipse-temurin:17-jre-jammy

# Thiết lập thư mục làm việc
WORKDIR /app

COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar app.jar

# Mở cổng 8080 để có thể truy cập ứng dụng từ bên ngoài container
EXPOSE 8080

# Lệnh để khởi chạy ứng dụng Spring Boot khi container bắt đầu
ENTRYPOINT ["java", "-jar", "app.jar"]