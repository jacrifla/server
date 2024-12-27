-- Users Table
CREATE TABLE USERS (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    auto_save_preference BOOLEAN DEFAULT FALSE,
    CONSTRAINT chk_email_format CHECK (email LIKE '%_@__%.__%')
);

CREATE INDEX idx_email ON USERS(email);

-- Brands Table
CREATE TABLE BRANDS (
    brand_id SERIAL PRIMARY KEY,
    brand_name VARCHAR(100) NOT NULL
);

-- Categories Table
CREATE TABLE CATEGORIES (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- Items Table
CREATE TABLE ITEMS (
    item_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES CATEGORIES(category_id),
    brand_id INT REFERENCES BRANDS(brand_id),
    barcode BIGINT,
    UNIQUE(product_name, brand_id, barcode)
);

CREATE INDEX idx_product_name ON ITEMS(product_name);

-- Price History Table
CREATE TABLE PRICE_HISTORY (
    history_id SERIAL PRIMARY KEY,
    item_id INT REFERENCES ITEMS(item_id),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT REFERENCES USERS(user_id),
    CONSTRAINT chk_positive_price CHECK (unit_price >= 0)
);

CREATE INDEX idx_updated_at ON PRICE_HISTORY(updated_at);

-- Shopping Lists Table
CREATE TABLE SHOPPING_LISTS (
    list_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES USERS(user_id),
    list_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('completed', 'pending')) DEFAULT 'pending'
);

CREATE INDEX idx_list_list_id ON SHOPPING_LISTS(list_id);
CREATE INDEX idx_list_status ON SHOPPING_LISTS(status);

-- Shopping List Items Table
CREATE TABLE SHOPPING_LIST_ITEMS (
    list_item_id SERIAL PRIMARY KEY,
    list_id INT REFERENCES SHOPPING_LISTS(list_id),
    item_id INT REFERENCES ITEMS(item_id),
    custom_product VARCHAR(100), -- For custom items
    item_type VARCHAR(20) CHECK (item_type IN ('custom', 'common')) DEFAULT 'common',
    quantity INT CHECK (quantity > 0),
    unit_price DECIMAL(10, 2),
    status VARCHAR(20) CHECK (status IN ('purchased', 'pending')) DEFAULT 'pending'
);

CREATE INDEX idx_list_item ON SHOPPING_LIST_ITEMS(list_id, item_id);
CREATE INDEX idx_list_item_status ON SHOPPING_LIST_ITEMS(status);

-- Item Notes Table
CREATE TABLE ITEM_NOTES (
    note_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES USERS(user_id),
    item_id INT REFERENCES ITEMS(item_id),
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_item_notes ON ITEM_NOTES(item_id);

CREATE TABLE shared_list (
    shared_list_id SERIAL PRIMARY KEY,
    list_id INT REFERENCES SHOPPING_LISTS(list_id),
    user_id INT REFERENCES users(user_id),
    permission BOOLEAN DEFAULT false,
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_shared_list_list_id ON shared_list(list_id);
CREATE INDEX idx_shared_list_user_id ON shared_list(user_id);
CREATE INDEX idx_shared_list_list_user ON shared_list(list_id, user_id);

CREATE TABLE shared_list_tokens (
    token_id SERIAL PRIMARY KEY,
    list_id INT REFERENCES shopping_lists(list_id),
    user_id INT REFERENCES users(user_id),
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

