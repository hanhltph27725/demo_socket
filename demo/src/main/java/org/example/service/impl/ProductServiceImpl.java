package org.example.service.impl;

import org.example.model.Product;
import org.example.repository.ProductRepository;
import org.example.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Random random = new Random();

    private static final long UPDATE_INTERVAL = 5000;

    @Override
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @Override
    public Product save(Product product) {
        return productRepository.save(product);
    }

    @Override
    @Scheduled(fixedRate = UPDATE_INTERVAL)
    public void updatePrices() {
        List<Product> products = productRepository.findAll();

        products.forEach(product -> {
            BigDecimal newPrice = BigDecimal.valueOf(18139 + random.nextDouble() * 100);
            product.setPrice(newPrice);
        });

        productRepository.saveAll(products);

        messagingTemplate.convertAndSend("/topic/product", products);
    }
}
