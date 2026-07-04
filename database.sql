-- ============================================
-- APAGAR E CRIAR A BASE DE DADOS
-- ============================================

DROP DATABASE IF EXISTS site_eventos_db;

CREATE DATABASE site_eventos_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE site_eventos_db;

-- ============================================
-- TABELA EVENTOS
-- ============================================

CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    data DATE NOT NULL
);

-- ============================================
-- INSERIR OS EVENTOS
-- ============================================

INSERT INTO eventos (nome, data) VALUES
('Fundamentos do Marketing Digital', '2026-07-08'),
('Redes Sociais na Prática', '2026-08-12'),
('SEO e Posicionamento no Google', '2026-09-09'),
('Publicidade Online', '2026-10-14'),
('Marketing de Conteúdo', '2026-11-11'),
('Inteligência Artificial aplicada ao Marketing', '2026-12-09'),
('Planeamento de Marketing Digital para 2027', '2027-01-13');

-- ============================================
-- VERIFICAÇÃO
-- ============================================

SELECT *
FROM eventos
ORDER BY data;