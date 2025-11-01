package com.example.demo.controller;

import com.example.demo.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")

public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping
    public ResponseEntity<?> getWeather(@RequestParam String city) {
        try {
            Object weatherData = weatherService.getWeatherForCity(city);
            return ResponseEntity.ok(weatherData);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = Map.of("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/forecast")
    public ResponseEntity<?> getForecast(@RequestParam String city) {
        try {
            Object forecastData = weatherService.getForecastForCity(city);
            return ResponseEntity.ok(forecastData);
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = Map.of("message", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }
    }
}