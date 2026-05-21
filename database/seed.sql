INSERT INTO products (name, price, sprite, pos_x, pos_y, scale)
VALUES
('Apfel', 1.99, './assets/sprites/shopItems/apple.png', 32, 227, 1.0),
('Banane', 2.49, './assets/sprites/shopItems/banana.png', 77, 227, 1.0),
('Dragonball', 999.99, './assets/sprites/shopItems/4sterne_dragonball.png', 624, 153, 1.0),
('Lifting Belt', 49.99, './assets/sprites/shopItems/lift_belt.png', 623, 227, 1.5),
('Creatine', 29.99, './assets/sprites/shopItems/creatine.png', 240, 270, 1.8),
('Protein Shake', 4.99, './assets/sprites/shopItems/protein_shake.png', 440, 270, 1.8);

INSERT INTO inventory (product_id, stock)
VALUES
(1, 10),
(2, 5),
(3, 1),
(4, 1),
(5, 3),
(6, 8);

INSERT INTO customers (name, money)
VALUES
('Max', 20),
('Anna', 35);