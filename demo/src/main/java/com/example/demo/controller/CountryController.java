package com.example.demo.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Adjust port if needed
public class CountryController {

    private static final String COUNTRIES_API_URL = "https://restcountries.com/v3.1/all?fields=name";

    @GetMapping("/countries")
    public List<String> getAllCountries() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String json = restTemplate.getForObject(COUNTRIES_API_URL, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);

            return root.findValues("name").stream()
                    .map(nameNode -> nameNode.has("common") ? nameNode.get("common").asText() : null)
                    .filter(name -> name != null)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            // Log the error and return an empty list or a custom error message
            e.printStackTrace();
            return List.of("Error fetching countries: " + e.getMessage());
        }
    }
}