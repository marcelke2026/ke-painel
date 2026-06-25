-- ============================================================
-- KE PAINEL DE GESTÃO CONTÁBIL — Schema Supabase
-- Execute este SQL no SQL Editor do seu projeto Supabase
-- Acesse: https://supabase.com → Seu Projeto → SQL Editor
-- ============================================================

-- Tabela principal: armazena todos os estados do painel
CREATE TABLE IF NOT EXISTS painel_estados (
  id          TEXT PRIMARY KEY,   -- ex: "statuses", "pagamentos", "valores", "responsaveis", "certEdits", "competencia"
  dados       JSONB NOT NULL DEFAULT '{}',
  atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  atualizado_por TEXT DEFAULT 'anônimo'
);

-- Inserir registros iniciais
INSERT INTO painel_estados (id, dados) VALUES
  ('competencia',   '"2026-07"'),
  ('statuses',      '{}'),
  ('pagamentos',    '{}'),
  ('valores',       '{}'),
  ('responsaveis',  '{}'),
  ('certEdits',     '{}')
ON CONFLICT (id) DO NOTHING;

-- Habilitar Realtime para a tabela
ALTER TABLE painel_estados REPLICA IDENTITY FULL;

-- Política de acesso público (leitura e escrita sem login)
-- Para um painel interno de equipe, isso é suficiente
ALTER TABLE painel_estados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público — leitura" ON painel_estados
  FOR SELECT USING (true);

CREATE POLICY "Acesso público — escrita" ON painel_estados
  FOR ALL USING (true);

-- ============================================================
-- PRONTO! Após executar, volte ao Vercel e faça o deploy.
-- ============================================================
