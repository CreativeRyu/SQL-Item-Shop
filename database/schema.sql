CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,

    sprite TEXT NOT NULL,

    pos_x INTEGER NOT NULL,
    pos_y INTEGER NOT NULL,
    scale REAL NOT NULL
);

CREATE TABLE inventory (
    product_id INTEGER,
    stock INTEGER NOT NULL,
    FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    money REAL NOT NULL
);

CREATE TABLE sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    sale_date TEXT,
    FOREIGN KEY(customer_id) REFERENCES customers(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);