package org.example.service;

import org.example.model.Product;

import java.util.List;

public interface ProductService {

    List<Product> getAll();

    Product save(Product product);

    void updatePrices();
}
