# 🚀 Guia de Deploy — KE Painel de Gestão Contábil
## Online · Colaborativo · Tempo Real

---

## O QUE VOCÊ VAI OBTER

- ✅ **URL pública** (ex: `ke-painel.vercel.app`) — acessível por celular, tablet e notebook
- ✅ **Sincronização em tempo real** — mudança de uma pessoa aparece para todas em segundos
- ✅ **Gratuito** — Vercel (hosting) + Supabase (banco de dados) têm planos gratuitos generosos
- ✅ **Sem servidor para manter** — tudo gerenciado na nuvem

---

## PASSO 1 — Criar conta no Supabase (banco de dados)

1. Acesse **https://supabase.com** e clique em **"Start your project"**
2. Faça login com sua conta GitHub ou Google
3. Clique em **"New Project"**
   - Nome: `ke-painel`
   - Senha do banco: anote em algum lugar seguro
   - Região: **South America (São Paulo)** ← importante para velocidade
4. Aguarde ~2 minutos para o projeto ser criado

---

## PASSO 2 — Criar as tabelas no Supabase

1. No painel do Supabase, clique em **"SQL Editor"** no menu lateral
2. Clique em **"New Query"**
3. Cole o conteúdo do arquivo **`supabase-schema.sql`** (que está nesta pasta)
4. Clique em **"Run"** (▶)
5. Você deve ver a mensagem: `Success. No rows returned`

---

## PASSO 3 — Pegar as credenciais do Supabase

1. No menu lateral, clique em **"Project Settings"** (ícone de engrenagem)
2. Clique em **"API"**
3. Copie os dois valores:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public key** → uma chave longa começando com `eyJ...`

---

## PASSO 4 — Publicar no Vercel

### Opção 4A — Via GitHub (recomendado para equipe)

1. Crie uma conta em **https://github.com** (se não tiver)
2. Crie um **novo repositório privado** chamado `ke-painel`
3. Faça upload de todos os arquivos desta pasta para o repositório
4. Acesse **https://vercel.com** e faça login com sua conta GitHub
5. Clique em **"Add New Project"** → selecione o repositório `ke-painel`
6. Na tela de configuração, em **"Environment Variables"**, adicione:
   ```
   REACT_APP_SUPABASE_URL     = https://SEU_PROJETO.supabase.co
   REACT_APP_SUPABASE_ANON_KEY = sua_chave_anon_aqui
   ```
7. Clique em **"Deploy"**
8. Aguarde ~3 minutos

### Opção 4B — Via Vercel CLI (mais técnico)

```bash
# Instale o Vercel CLI
npm install -g vercel

# Dentro da pasta ke-painel:
vercel

# Siga as instruções e configure as variáveis de ambiente quando solicitado
```

---

## PASSO 5 — Configurar variáveis de ambiente

Se usou a Opção 4A, as variáveis já foram configuradas.

Se precisar editar depois:
1. No Vercel, abra seu projeto
2. Vá em **Settings → Environment Variables**
3. Adicione/edite as variáveis `REACT_APP_SUPABASE_URL` e `REACT_APP_SUPABASE_ANON_KEY`
4. Clique em **"Redeploy"** para aplicar

---

## PASSO 6 — Compartilhar com a equipe

Após o deploy, o Vercel vai te dar uma URL como:
```
https://ke-painel-gestao.vercel.app
```

**Compartilhe esta URL com sua equipe.**

- Funciona em qualquer navegador (Chrome, Safari, Firefox)
- Funciona em celular, tablet e notebook
- Não precisa instalar nada
- Alterações são sincronizadas em tempo real entre todos os usuários

---

## OPCIONAL — Domínio personalizado

1. No Vercel, vá em **Settings → Domains**
2. Adicione um domínio como `painel.kesistemas.com.br`
3. Configure o DNS conforme as instruções do Vercel

---

## DÚVIDAS FREQUENTES

**Q: Quantas pessoas podem usar ao mesmo tempo?**
A: Ilimitado. O plano gratuito do Supabase suporta até 500 conexões simultâneas.

**Q: Os dados ficam salvos se eu fechar o navegador?**
A: Sim. Todos os dados (status, responsáveis, valores, pagamentos) ficam salvos no banco Supabase.

**Q: Como controlo quem pode editar?**
A: Por padrão, qualquer pessoa com o link pode editar. Para adicionar login/senha, me avise que posso implementar autenticação.

**Q: O que acontece se duas pessoas editarem ao mesmo tempo?**
A: O sistema usa "last write wins" — a última alteração salva vence. Para um painel de uso interno da equipe, isso funciona bem.

**Q: Preciso pagar alguma coisa?**
A: Não para começar. Vercel (hobby plan) e Supabase (free tier) cobrem bem um uso de escritório. Se crescer muito, o custo é baixo (~$25/mês).

---

## ESTRUTURA DOS ARQUIVOS

```
ke-painel/
├── public/
│   └── index.html              ← Página HTML base
├── src/
│   ├── index.js                ← Ponto de entrada React
│   ├── App.js                  ← Componente raiz
│   ├── supabaseClient.js       ← Conexão com o Supabase
│   ├── useSync.js              ← Hook de sincronização em tempo real
│   └── PainelGestaoContabil.jsx ← O painel completo
├── .env.example                ← Template das variáveis de ambiente
├── package.json                ← Dependências do projeto
└── supabase-schema.sql         ← SQL para criar as tabelas
```

---

## SUPORTE

Se tiver algum problema durante o deploy, me informe o erro exato e te ajudo a resolver.
