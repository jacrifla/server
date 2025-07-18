-- Criar tabela USERS (Usuários)
CREATE TABLE USERS (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(100) NOT NULL,
    EMAIL VARCHAR(150) NOT NULL UNIQUE,
    PASSWORD VARCHAR(255) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP,
    DELETED_AT TIMESTAMP,
    CONSTRAINT CHK_EMAIL_FORMAT CHECK (EMAIL LIKE '%@%.%')
);
CREATE INDEX idx_users_email ON USERS (EMAIL);

-- Criar tabela UNITS (Unidades)
CREATE TABLE UNITS (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(50) NOT NULL UNIQUE
);

-- Criar tabela BRANDS (Marcas)
CREATE TABLE BRANDS (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL UNIQUE
);
CREATE INDEX idx_brand_name ON BRANDS (NAME);

-- Criar tabela CATEGORIES (Categorias)
CREATE TABLE CATEGORIES (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL UNIQUE,
    DESCRIPTION TEXT NULL
);
CREATE INDEX idx_category_name ON CATEGORIES (NAME);

-- Criar tabela LISTS (Listas)
CREATE TABLE LISTS (
    ID SERIAL PRIMARY KEY,
    USER_ID INT NOT NULL,
    NAME VARCHAR(255) NOT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP,
    COMPLETED_AT TIMESTAMP,
    TOTAL_AMOUNT DECIMAL(10,2) DEFAULT 0.00,
    CONSTRAINT FK_USER_LIST FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);
CREATE INDEX idx_lists_user_id ON LISTS (USER_ID);

-- Criar tabela SHARED_LISTS (Compartilhamento de Listas)
CREATE TABLE SHARED_LISTS (
    ID SERIAL PRIMARY KEY,
    USER_ID INT NOT NULL,
    SHARED_USER_ID INT NOT NULL,
    LIST_ID INT NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_USER_SHARED FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    CONSTRAINT FK_SHARED_WITH FOREIGN KEY (SHARED_USER_ID) REFERENCES USERS(ID),
    CONSTRAINT FK_LIST_SHARED FOREIGN KEY (LIST_ID) REFERENCES LISTS(ID) ON DELETE CASCADE
);
CREATE INDEX idx_shared_lists_user_id ON SHARED_LISTS (USER_ID);
CREATE INDEX idx_shared_lists_list_id ON SHARED_LISTS (LIST_ID);

-- Criar tabela ITEMS (Itens)
CREATE TABLE ITEMS (
    ID SERIAL PRIMARY KEY,
    CATEGORY_ID INT NULL,
    BRAND_ID INT NULL,
    USER_ID INT NULL,
    UNIT_ID INT NULL,
    UPDATED_BY INT NULL,
    NAME VARCHAR(255) NOT NULL,
    BARCODE BIGINT NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UPDATED_AT TIMESTAMP,
    DELETED_AT TIMESTAMP,
    CONSTRAINT FK_BRAND FOREIGN KEY (BRAND_ID) REFERENCES BRANDS(ID),
    CONSTRAINT FK_CATEGORY FOREIGN KEY (CATEGORY_ID) REFERENCES CATEGORIES(ID),
    CONSTRAINT FK_USER_ITEM FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    CONSTRAINT FK_UPDATED_BY FOREIGN KEY (UPDATED_BY) REFERENCES USERS(ID),
    CONSTRAINT FK_UNIT FOREIGN KEY (UNIT_ID) REFERENCES UNITS(ID),
    UNIQUE (NAME, BRAND_ID, BARCODE)
);
CREATE INDEX idx_items_category_id ON ITEMS (CATEGORY_ID);
CREATE INDEX idx_items_brand_id ON ITEMS (BRAND_ID);
CREATE INDEX idx_items_user_id ON ITEMS (USER_ID);

-- Criar tabela LIST_ITEMS (Itens da Lista)
CREATE TABLE LIST_ITEMS (
    ID SERIAL PRIMARY KEY,
    LIST_ID INT NOT NULL,
    ITEM_ID INT NULL,
    ITEM_NAME VARCHAR(255) NULL,
    ITEM_TYPE VARCHAR(20) NOT NULL DEFAULT 'custom',
    QUANTITY DECIMAL(10,3) CHECK (QUANTITY > 0),
    PRICE DECIMAL(10,2) NULL,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PURCHASED_AT TIMESTAMP NULL,
    CONSTRAINT FK_LIST_LISTITEM FOREIGN KEY (LIST_ID) REFERENCES LISTS(ID) ON DELETE CASCADE,
    CONSTRAINT FK_ITEM_LISTITEM FOREIGN KEY (ITEM_ID) REFERENCES ITEMS(ID) ON DELETE SET NULL
);
CREATE INDEX idx_list_items_list_id ON LIST_ITEMS (LIST_ID);
CREATE INDEX idx_list_items_item_id ON LIST_ITEMS (ITEM_ID);

-- Criar tabela MARKETS (Mercados)
CREATE TABLE MARKETS (
    ID SERIAL PRIMARY KEY,
    NAME VARCHAR(255) NOT NULL UNIQUE,
    CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_market_name ON MARKETS (NAME);

-- Criar tabela PURCHASES (Compras)
CREATE TABLE PURCHASES (
    ID SERIAL PRIMARY KEY,
    ITEM_ID INT NOT NULL,
    USER_ID INT NOT NULL,
    MARKET_ID INT,
    QUANTITY DECIMAL(10,3) CHECK (QUANTITY > 0),
    PRICE DECIMAL(10,2) NULL,
    TOTAL DECIMAL(10,2) NOT NULL,
    PURCHASE_DATE DATE NULL,
    CONSTRAINT FK_ITEM_PURCHASE FOREIGN KEY (ITEM_ID) REFERENCES ITEMS(ID) ON DELETE SET NULL,
    CONSTRAINT FK_USER_PURCHASE FOREIGN KEY (USER_ID) REFERENCES USERS(ID),
    CONSTRAINT FK_MARKET FOREIGN KEY (MARKET_ID) REFERENCES MARKETS(ID)
);
CREATE INDEX idx_purchases_user_id ON PURCHASES (USER_ID);
CREATE INDEX idx_purchases_item_id ON PURCHASES (ITEM_ID);
CREATE INDEX idx_purchases_purchase_date ON PURCHASES (PURCHASE_DATE);
CREATE INDEX idx_purchases_market_id ON PURCHASES (MARKET_ID);

-- Criar tabela LIST_TOTALS (Totais das Listas)
CREATE TABLE LIST_TOTALS (
    ID SERIAL PRIMARY KEY,
    LIST_ID INT,
    USER_ID INT NOT NULL,
    TOTAL DECIMAL(10,2) NOT NULL,
    PURCHASE_DATE DATE NOT NULL,
    FOREIGN KEY (LIST_ID) REFERENCES LISTS(ID) ON DELETE SET NULL,
    FOREIGN KEY (USER_ID) REFERENCES USERS(ID)
);
CREATE INDEX idx_list_totals_user_id ON LIST_TOTALS (USER_ID);
CREATE INDEX idx_list_totals_list_id ON LIST_TOTALS (LIST_ID);
CREATE INDEX idx_list_totals_purchase_date ON LIST_TOTALS (PURCHASE_DATE);

-- Criar tabela SHARE_TOKENS (Compartilhamento de Tokens)
CREATE TABLE SHARE_TOKENS (
    ID SERIAL PRIMARY KEY,
    LIST_ID INT NOT NULL,
    TOKEN VARCHAR(255) NOT NULL,
    CREATED_AT TIMESTAMP NOT NULL,
    EXPIRES_AT TIMESTAMP NOT NULL,
    CONSTRAINT FK_LIST_TOKEN FOREIGN KEY (LIST_ID) REFERENCES LISTS(ID)
);
CREATE INDEX idx_share_tokens_list_id ON SHARE_TOKENS (LIST_ID);
CREATE INDEX idx_share_tokens_token ON SHARE_TOKENS (TOKEN);