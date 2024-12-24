-- Tabela de Usuários
CREATE TABLE USUARIOS (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('ativo', 'inativo')) DEFAULT 'ativo',
    preferencia_salvar_automatico BOOLEAN DEFAULT FALSE,
    CONSTRAINT chk_email_format CHECK (email LIKE '%_@__%.__%')
);

CREATE INDEX idx_email ON USUARIOS(email);

-- Tabela de Marcas
CREATE TABLE MARCAS (
    id_marca SERIAL PRIMARY KEY,
    nome_marca VARCHAR(100) NOT NULL
);

-- Tabela de Categorias
CREATE TABLE CATEGORIA (
    id_categoria SERIAL PRIMARY KEY,
    nome_categoria VARCHAR(100) NOT NULL
);

-- Tabela de Itens
CREATE TABLE ITEM (
    id_item SERIAL PRIMARY KEY,
    nome_produto VARCHAR(100) NOT NULL,
    id_categoria INT REFERENCES CATEGORIA(id_categoria),
    id_marca INT REFERENCES MARCAS(id_marca),
    codigo_barras BIGINT,
    UNIQUE(nome_produto, id_marca, codigo_barras)
);

CREATE INDEX idx_nome_produto ON ITEM(nome_produto);

-- Tabela de Histórico de Preços
CREATE TABLE HISTORICO_PRECO (
    id_historico SERIAL PRIMARY KEY,
    id_item INT REFERENCES ITEM(id_item),
    preco_unitario DECIMAL(10, 2) NOT NULL CHECK (preco_unitario >= 0),
    data_alteracao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT REFERENCES USUARIOS(id_usuario),
    CONSTRAINT chk_preco_positivo CHECK (preco_unitario >= 0)
);

CREATE INDEX idx_data_alteracao ON HISTORICO_PRECO(data_alteracao);

-- Tabela de Lista de Compras
CREATE TABLE LISTA_COMPRAS (
    id_lista SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES USUARIOS(id_usuario),
    nome_lista VARCHAR(100) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_conclusao TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('finalizada', 'pendente')) DEFAULT 'pendente'
);

CREATE INDEX idx_lista_status ON LISTA_COMPRAS(status);

-- Tabela de Itens na Lista de Compras
CREATE TABLE ITEM_LISTA (
    id_item_lista SERIAL PRIMARY KEY,
    id_lista INT REFERENCES LISTA_COMPRAS(id_lista),
    id_item INT REFERENCES ITEM(id_item),
    produto_custom VARCHAR(100), -- Para itens não cadastrados previamente
    tipo_item VARCHAR(20) CHECK (tipo_item IN ('customizado', 'comum')) DEFAULT 'comum', -- Indica se o item é customizado ou não
    quantidade INT CHECK (quantidade > 0) NULL,
    preco_unitario DECIMAL(10, 2) NULL,
    status VARCHAR(20) CHECK (status IN ('comprado', 'pendente')) DEFAULT 'pendente'
);
CREATE INDEX idx_item_lista ON ITEM_LISTA(id_lista, id_item);
CREATE INDEX idx_item_lista_status ON ITEM_LISTA(status);

-- Tabela de Anotações dos Itens
CREATE TABLE ANOTACOES_ITEM (
    id_anotacao SERIAL PRIMARY KEY,
    id_usuario INT REFERENCES USUARIOS(id_usuario),
    id_item INT REFERENCES ITEM(id_item),
    anotacao TEXT,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice no id_item para otimizar as buscas de anotações
CREATE INDEX idx_anotacoes_item ON ANOTACOES_ITEM(id_item);
