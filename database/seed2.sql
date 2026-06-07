INSERT INTO products (id, name, price)
VALUES
(1, 'Apfel', 1.99),
(2, 'Banane', 2.49),
(3, 'Karotte', 2.99),
(4, 'Tomate', 3.49),
(5, 'Gurke', 4.49),
(6, 'Kartoffel', 5.99),
(7, 'Rubin', 49.99),
(8, 'Query Blueprint', 25.00),
(9, 'Protein Shake', 4.99),
(10, 'Creatine', 29.99),
(11, 'Lifting Belt', 49.99),
(12, 'Shopkeeper Hint', 10.00);

INSERT INTO inventory (product_id, stock)
VALUES
(1, 50),
(2, 40),
(3, 25),
(4, 20),
(5, 15),
(6, 10),
(7, 1),
(8, 1),
(9, 8),
(10, 2),
(11, 1),
(12, 1);

INSERT INTO customers (name, budget)
VALUES
('Tom', 5),
('Max', 20),
('Anna', 35),
('Lena', 50),
('Marie', 100),
('Baron von Query', 1000);
