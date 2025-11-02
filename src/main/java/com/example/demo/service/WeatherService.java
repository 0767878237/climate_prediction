package com.example.demo.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class WeatherService {

    @Value("${OPENWEATHERMAP_API_KEY}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public WeatherService() {
        this.restTemplate = new RestTemplate();
    }

    public Object getWeatherForCity(String city) {
        System.out.println("--- Đang sử dụng API Key: " + apiKey);

        String url = String.format(
                "https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric&lang=vi",
                city, apiKey
        );
        System.out.println("--- Đang gọi đến URL: " + url);

        try {
            return restTemplate.getForObject(url, Object.class);
        } catch (HttpClientErrorException e) {
            System.err.println("!!! Lỗi từ API: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("Không tìm thấy dữ liệu thời tiết cho thành phố: " + city, e);
        }
    }

    public Object getForecastForCity(String city) {
        String url = String.format(
                "https://api.openweathermap.org/data/2.5/forecast?q=%s&appid=%s&units=metric&lang=vi",
                city, apiKey
        );
        System.out.println("--- Đang gọi đến URL dự báo: " + url);
        try {
            return restTemplate.getForObject(url, Object.class);
        } catch (HttpClientErrorException e) {
            System.err.println("!!! Lỗi từ API dự báo: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
            throw new RuntimeException("Không tìm thấy dữ liệu dự báo cho thành phố: " + city, e);
        }
    }
}