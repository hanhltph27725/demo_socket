package org.example.controller;

import org.example.model.Product;
import org.example.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping("/list")
    public List<Product> getAllProduct(){
        return productService.getAll();
    }

    @MessageMapping("/products")
    @SendTo("/topic/product")
    public Product create(@RequestBody Product product){
        return productService.save(product);
    }

    @PutMapping("/update-prices")
    public void updatePrices() {
        productService.updatePrices();
    }
}
