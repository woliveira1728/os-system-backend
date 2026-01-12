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
├── src/
│       ├── app.ts                 # Configuração do Fastify
│       ├── server.ts              # Entry point
│       ├── controllers/           # Handlers das rotas
│       │       ├── auth.controllers.ts
│       │       ├── order.controllers.ts
│       │       ├── checklist.controllers.ts
│       │       ├── photo.controllers.ts
│       │       └── index.ts
│       ├── services/              # Lógica de negócio
│       │       ├── auth.services.ts
│       │       ├── order.services.ts
│       │       ├── checklist.services.ts
│       │       ├── photo.services.ts
│       │       └── index.ts
│       ├── routes/                # Definição de rotas
│       │       ├── auth.routes.ts
│       │       ├── order.routes.ts
│       │       ├── checklist.routes.ts
│       │       ├── photo.routes.ts
│       │       └── index.ts
│       ├── interfaces/            # TypeScript interfaces (DTOs)
│       │       ├── auth.interfaces.ts
│       │       ├── order.interfaces.ts
│       │       ├── checklist.interfaces.ts
│       │       ├── photo.interfaces.ts
│       │       └── index.ts
│       ├── middlewares/           # Middlewares do Fastify
│       │       ├── authGuard.ts
│       │       └── isEmailAlready.ts
│       ├── schemas/               # Schemas de validação
│       │       └── auth.schema.ts
│       ├── errors/                # Tratamento de erros
│       │       ├── appError.ts
│       │       └── handleErrors.middleware.ts
│       ├── lib/                   # Utilitários
│       │       ├── jwt.ts
│       │       └── prisma.ts
│       └── utils/                 # Funções auxiliares
│                 └── jwt.ts
├── uploads/               # Diretório para uploads
│       └── photos/
└── prisma                 # Configuração do Prisma ORM (schema, migrations e versionamento do banco)
          ├── migrations         # Histórico de migrações do banco de dados
          └── schema.prisma      # Definição dos modelos, relações e configuração do banco
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
	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjbWthZTQ2cmcwMDAwcDgzbzl5M3N4OGlyIiwiZW1haWwiOiJqb2FvQGV4YW1wbGUuY29tIiwicm9sZSI6IlRFQ0hOSUNJQU4iLCJpYXQiOjE3NjgxNzU2MzEsImV4cCI6MTc2ODI2MjAzMX0.vJyHZyAyYFloPRYMKNm8md8exzL6GAnH-69fcZE7D8g",
	"user": {
		"id": "cmkae46rg0000p83o9y3sx8ir",
		"name": "Nome do Usuário",
		"email": "usuario@example.com",
		"role": "TECHNICIAN"
	}
}
```

### Ordens de Serviço

#### Listar todas as ordens
```
GET /api/orders
Authorization: Bearer {accessToken}

Response:
[
	{
		"id": "cmkae811q000ap83ob38wsvro",
		"userId": "cmkae46rg0000p83o9y3sx8ir",
		"title": "teste",
		"description": "Mussum Ipsum, cacilds vidis litro abertis. Mais vale um bebadis conhecidiss, que um alcoolatra anonimis. Nullam volutpat risus nec leo commodo, ut interdum diam laoreet. Sed non consequat odio. Sapien in monti palavris qui num significa nadis i pareci latim. Paisis, filhis, espiritis santis.",
		"status": "PENDING",
		"priority": "NORMAL",
		"createdAt": "2026-01-11T23:56:47.822Z",
		"updatedAt": "2026-01-11T23:56:47.822Z",
		"completedAt": null,
		"scheduledAt": null,
		"checklist": [],
		"photos": []
	},
]
```

#### Criar ordem
```
POST /api/orders
Authorization: Bearer {accessToken}
Content-Type: application/json

{
	"title": "teste",
	"description": "Mussum Ipsum, cacilds vidis litro abertis. Mais vale um bebadis conhecidiss, que um alcoolatra anonimis. Nullam volutpat risus nec leo commodo, ut interdum diam laoreet. Sed non consequat odio. Sapien in monti palavris qui num significa nadis i pareci latim. Paisis, filhis, espiritis santis."
}

Response:
{
	"id": "cmkae811q000ap83ob38wsvro",
	"userId": "cmkae46rg0000p83o9y3sx8ir",
	"title": "teste",
	"description": "Mussum Ipsum, cacilds vidis litro abertis. Mais vale um bebadis conhecidiss, que um alcoolatra anonimis. Nullam volutpat risus nec leo commodo, ut interdum diam laoreet. Sed non consequat odio. Sapien in monti palavris qui num significa nadis i pareci latim. Paisis, filhis, espiritis santis.",
	"status": "PENDING",
	"priority": "NORMAL",
	"createdAt": "2026-01-11T23:56:47.822Z",
	"updatedAt": "2026-01-11T23:56:47.822Z",
	"completedAt": null,
	"scheduledAt": null,
	"checklist": [],
	"photos": []
}
```

#### Obter ordem por ID
```
GET /api/orders/:id
Authorization: Bearer {accessToken}

Response:
{
	"id": "cmkae811q000ap83ob38wsvro",
	"userId": "cmkae46rg0000p83o9y3sx8ir",
	"title": "teste",
	"description": "Mussum Ipsum, cacilds vidis litro abertis. Mais vale um bebadis conhecidiss, que um alcoolatra anonimis. Nullam volutpat risus nec leo commodo, ut interdum diam laoreet. Sed non consequat odio. Sapien in monti palavris qui num significa nadis i pareci latim. Paisis, filhis, espiritis santis.",
	"status": "PENDING",
	"priority": "NORMAL",
	"createdAt": "2026-01-11T23:56:47.822Z",
	"updatedAt": "2026-01-11T23:56:47.822Z",
	"completedAt": null,
	"scheduledAt": null,
	"checklist": [],
	"photos": [],
	"user": {
		"id": "cmkae46rg0000p83o9y3sx8ir",
		"name": "João Silva",
		"email": "joao@example.com",
		"role": "TECHNICIAN"
	}
}
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

#### Atualizar status da ordem
```
PATCH /api/orders/:id/status
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```

### Checklist

#### Listar itens de checklist
```
GET /api/orders/:orderId/checklist
Authorization: Bearer {accessToken}

Response:
[
  {
    "id": "cmkae811q000ap83ob38wsvro",
    "orderId": "cmkae811q000ap83ob38wsvro",
    "title": "Verificar conexão",
    "completed": false,
    "required": true,
    "order": 0,
    "createdAt": "2026-01-11T23:56:47.822Z",
    "updatedAt": "2026-01-11T23:56:47.822Z"
  },
  {
    "id": "cmkae811q000ap83ob38wsvr1",
    "orderId": "cmkae811q000ap83ob38wsvro",
    "title": "Testar equipamento",
    "completed": true,
    "required": false,
    "order": 1,
    "createdAt": "2026-01-11T23:56:47.822Z",
    "updatedAt": "2026-01-11T23:56:47.822Z"
  }
]
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

Response:
{
  "id": "cmkae811q000ap83ob38wsvr2",
  "orderId": "cmkae811q000ap83ob38wsvro",
  "title": "Verificar conexão",
  "completed": false,
  "required": true,
  "order": 2,
  "createdAt": "2026-01-11T23:56:47.822Z",
  "updatedAt": "2026-01-11T23:56:47.822Z"
}
```

#### Atualizar item
```
PUT /api/checklist/:id
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "title": "Novo título",
  "completed": true
}

Response:
{
  "id": "cmkae811q000ap83ob38wsvr2",
  "orderId": "cmkae811q000ap83ob38wsvro",
  "title": "Novo título",
  "completed": true,
  "required": true,
  "order": 2,
  "createdAt": "2026-01-11T23:56:47.822Z",
  "updatedAt": "2026-01-11T23:56:47.822Z"
}
```

#### Togglear completude do item
```
PATCH /api/checklist/:id/toggle
Authorization: Bearer {accessToken}

Response:
{
  "id": "cmkae811q000ap83ob38wsvr2",
  "orderId": "cmkae811q000ap83ob38wsvro",
  "title": "Novo título",
  "completed": false,
  "required": true,
  "order": 2,
  "createdAt": "2026-01-11T23:56:47.822Z",
  "updatedAt": "2026-01-11T23:56:47.822Z"
}
```

#### Deletar item
```
DELETE /api/checklist/:id
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

Response:
{
  "id": "cmkae811q000ap83ob38wsvr3",
  "orderId": "cmkae811q000ap83ob38wsvro",
  "filename": "1705015007822_example.jpg",
  "url": "/uploads/photos/1705015007822_example.jpg",
  "size": 245678,
  "mimeType": "image/jpeg",
  "description": "Descrição da foto",
  "createdAt": "2026-01-11T23:56:47.822Z",
  "updatedAt": "2026-01-11T23:56:47.822Z"
}
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
