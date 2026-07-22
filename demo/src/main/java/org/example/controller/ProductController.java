package org.example.controller;

import org.example.entity.Product;
import org.example.service.ProductService;
import org.example.service.SseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private SseService sseService;

    @GetMapping("/list")
    public List<Product> getAllProduct(){
        return productService.getAll();
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream() {
        return sseService.subscribe();
    }

    @PostMapping("/products")
    public List<Product> create(@RequestBody Product product) {
        productService.save(product);
        return productService.getAll();
    }

    @PutMapping("/update-prices")
    public void updatePrices() {
        productService.updatePrices();
    }
}
