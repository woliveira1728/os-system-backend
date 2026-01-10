# OS System Backend API

Servidor backend do **OS System** — um sistema completo de gerenciamento de ordens de serviço com autenticação, checklist, fotos e rastreamento de status.

Desenvolvido com **Fastify**, **Prisma ORM** e **PostgreSQL** para oferecer uma API robusta e escalável.

## Arquitetura do Sistema

O OS System é composto por três repositórios principais:

- **Backend API** (este repositório) — Servidor Fastify com Prisma ORM, autenticação JWT, e endpoints para gerenciamento de ordens, checklist e fotos
- **[Frontend Web](https://github.com/woliveira1728/os-system-frontend)** — Aplicação Next.js 14 com interface responsiva para criação, edição, exclusão e acompanhamento de ordens de serviço
- **[Infraestrutura](https://github.com/woliveira1728/os-system)** — Orquestração com Docker Compose, variáveis de ambiente e scripts de inicialização

## Tecnologias

- **Runtime**: Node.js >= 20
- **Framework**: Fastify 5.6.0
- **Linguagem**: TypeScript 5.8.3
- **ORM**: Prisma 6.19.1
- **Banco de Dados**: PostgreSQL 15
- **Autenticação**: JWT (JSON Web Tokens)
- **Container**: Docker
- **Injeção de Dependências**: tsyringe

## Pré-requisitos

- Node.js >= 20
- npm ou yarn
- PostgreSQL 15
- Docker (opcional)

## Instalação e Setup

Para instruções detalhadas sobre instalação, configuração do banco de dados e como rodar a aplicação localmente, consulte o repositório de [Infraestrutura](https://github.com/woliveira1728/os-system).

Resumidamente, o repositório de infraestrutura fornece:
- Orquestração com Docker Compose
- Script `init.sh` para clonar todos os repositórios
- Variáveis de ambiente pré-configuradas
- Comandos para subir a stack completa com um único comando

A aplicação estará disponível em `http://localhost:4000`

## Estrutura de Pastas

```
src/
├── app.ts                 # Configuração do Fastify
├── server.ts              # Entry point
├── controllers/           # Handlers das rotas
│   ├── auth.controllers.ts
│   ├── order.controllers.ts
│   ├── checklist.controllers.ts
│   ├── photo.controllers.ts
│   └── index.ts
├── services/              # Lógica de negócio
│   ├── auth.services.ts
│   ├── order.services.ts
│   ├── checklist.services.ts
│   ├── photo.services.ts
│   └── index.ts
├── routes/                # Definição de rotas
│   ├── auth.routes.ts
│   ├── order.routes.ts
│   ├── checklist.routes.ts
│   ├── photo.routes.ts
│   └── index.ts
├── interfaces/            # TypeScript interfaces (DTOs)
│   ├── auth.interfaces.ts
│   ├── order.interfaces.ts
│   ├── checklist.interfaces.ts
│   ├── photo.interfaces.ts
│   └── index.ts
├── middlewares/           # Middlewares do Fastify
│   ├── authGuard.ts
│   └── isEmailAlready.ts
├── schemas/               # Schemas de validação
│   └── auth.schema.ts
├── errors/                # Tratamento de erros
│   ├── appError.ts
│   └── handleErrors.middleware.ts
├── lib/                   # Utilitários
│   ├── jwt.ts
│   └── prisma.ts
├── utils/                 # Funções auxiliares
│   └── jwt.ts
└── uploads/               # Diretório para uploads
    └── photos/
```

## Endpoints da API

### Autenticação

#### Registrar usuário
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123",
  "name": "Nome do Usuário"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### Ordens de Serviço

#### Listar todas as ordens
```
GET /api/orders
Authorization: Bearer {accessToken}
```

#### Criar ordem
```
POST /api/orders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Reparo na porta",
  "description": "Porta emperrada, necessário óleo",
  "priority": "NORMAL",
  "scheduledAt": "2026-01-15T10:00:00Z"
}
```

#### Obter ordem por ID
```
GET /api/orders/:id
Authorization: Bearer {accessToken}
```

#### Atualizar ordem
```
PUT /api/orders/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Novo título",
  "description": "Nova descrição",
  "status": "IN_PROGRESS",
  "priority": "HIGH"
}
```

#### Deletar ordem
```
DELETE /api/orders/:id
Authorization: Bearer {accessToken}
```

### Checklist

#### Listar itens de checklist
```
GET /api/orders/:orderId/checklist
Authorization: Bearer {accessToken}
```

#### Adicionar item
```
POST /api/orders/:orderId/checklist
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Verificar conexão",
  "required": true
}
```

#### Atualizar item
```
PUT /api/checklist/:itemId
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Novo título",
  "completed": true
}
```

#### Deletar item
```
DELETE /api/checklist/:itemId
Authorization: Bearer {accessToken}
```

### Fotos

#### Upload de foto
```
POST /api/photos/:orderId
Authorization: Bearer {accessToken}
Content-Type: multipart/form-data

Form Data:
- file: <arquivo de imagem>
- description: "Descrição da foto" (opcional)
```

#### Deletar foto
```
DELETE /api/photos/:photoId
Authorization: Bearer {accessToken}
```

## Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. 

- **Access Token**: Válido por 1 hora
- **Refresh Token**: Válido por 7 dias

Inclua o token no header de autorização:
```
Authorization: Bearer {accessToken}
```

## Banco de Dados

### Schema Principal

O Prisma gerencia o schema do banco através de migrations. Veja `prisma/schema.prisma` para a estrutura completa.

**Entidades principais:**
- `User` — Usuários do sistema
- `Order` — Ordens de serviço
- `Checklist` — Itens de checklist das ordens
- `Photo` — Fotos anexadas às ordens
- `RefreshToken` — Tokens de renovação de sessão

## Tratamento de Erros

A API retorna erros padronizados com status HTTP apropriados:

```json
{
  "message": "Descrição do erro",
  "status": 400
}
```

Status comuns:
- `400` — Requisição inválida
- `401` — Não autenticado
- `403` — Não autorizado
- `404` — Recurso não encontrado
- `409` — Conflito (ex: email já existe)
- `500` — Erro interno do servidor

## Desenvolvimento

### Adicionar nova rota

1. Crie o serviço em `src/services/`
2. Crie o controller em `src/controllers/`
3. Defina a interface em `src/interfaces/`
4. Crie a rota em `src/routes/`
5. Importe e registre em `src/routes/index.ts`

### Migrations

Para criar uma nova migration após alterar o schema:
```bash
npm run db:migrate
```

## Relacionado

- [Frontend Web](https://github.com/woliveira1728/os-system-frontend)
- [Infraestrutura](https://github.com/woliveira1728/os-system)

## Licença

MIT
