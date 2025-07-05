# Mini Estante

Projeto completo para gerenciar sua coleção de livros, com backend em Node.js/Express/Prisma/PostgreSQL e frontend em React + Vite.

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) (recomendado v18+)
- [npm](https://www.npmjs.com/) (vem junto com o Node)
- [PostgreSQL](https://www.postgresql.org/) rodando localmente

---

## Passo a passo para rodar o projeto

### 1. Clone o repositório

```bash
git clone <url-do-repo>
cd mini_estante
```

### 2. Configure o banco de dados

- Crie um banco chamado `mini_estante` no seu PostgreSQL:

```bash
psql -U postgres
CREATE DATABASE mini_estante;
```

- (Opcional) Altere o usuário/senha/porta conforme sua instalação.

### 3. Configure as variáveis de ambiente

- Copie o arquivo de exemplo `.env.example` para `.env` dentro da pasta `backend`:

```bash
cd backend
cp .env.example .env
```

- Edite o arquivo `.env` se necessário, ajustando `DATABASE_URL`, `JWT_SECRET` etc.

### 4. Instale as dependências do backend

```bash
npm install
```

### 5. Rode as migrations do Prisma e gere o client

```bash
npx prisma migrate deploy
npx prisma generate
```

### 6. Crie o usuário administrador

```bash
npx ts-node createAdmin.ts
```

> Isso criará um usuário admin padrão (veja o script para usuário/senha).

### 7. Inicie o backend

```bash
npm run dev
```

O backend estará rodando em `http://localhost:3333` (ou porta definida no `.env`).

---

### 8. Instale as dependências do frontend

Abra outro terminal e vá para a pasta `frontend`:

```bash
cd ../frontend
npm install
```

### 9. Inicie o frontend

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (ou porta do Vite).

---

## Observações

- O backend espera um banco PostgreSQL rodando e acessível conforme o `.env`.
- O frontend faz requisições para o backend (ajuste CORS se necessário).
- O usuário admin é criado via script e pode ser usado para acessar a área administrativa.
- Para redefinição de senha por email, seria necessário implementar e configurar SMTP e campos extras (veja comentários no código).

---

## Scripts úteis

- Rodar backend em modo dev: `npm run dev` (na pasta backend)
- Rodar frontend em modo dev: `npm run dev` (na pasta frontend)
- Gerar Prisma Client: `npx prisma generate`
- Rodar migrations: `npx prisma migrate deploy`
- Criar admin: `npx ts-node createAdmin.ts`

---
