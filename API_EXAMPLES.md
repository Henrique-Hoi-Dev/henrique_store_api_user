# Exemplos de Uso da API - Microserviço de Usuários

Este documento contém exemplos práticos de como usar a API do microserviço de usuários.

## 🔐 Autenticação

### 1. Registro de Usuário

```bash
curl -X POST http://localhost:3000/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456",
    "cpf": "123.456.789-00",
    "phone": "(11) 99999-9999",
    "birth_date": "1990-01-01",
    "gender": "MALE",
    "role": "CUSTOMER",
    "address": {
      "street": "Rua das Flores",
      "number": "123",
      "complement": "Apto 45",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zip_code": "01234-567",
      "country": "Brasil"
    },
    "marketing_consent": true,
    "newsletter_subscription": false
  }'
```

**Resposta:**

```json
{
    "user": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "João Silva",
        "email": "joao@example.com",
        "cpf": "123.456.789-00",
        "phone": "(11) 99999-9999",
        "birthDate": "1990-01-01",
        "gender": "MALE",
        "role": "CUSTOMER",
        "isActive": true,
        "emailVerified": false,
        "phoneVerified": false,
        "address": {
            "street": "Rua das Flores",
            "number": "123",
            "complement": "Apto 45",
            "neighborhood": "Centro",
            "city": "São Paulo",
            "state": "SP",
            "zipCode": "01234-567",
            "country": "Brasil"
        },
        "marketingConsent": true,
        "newsletterSubscription": false,
        "createdAt": "2024-12-01T10:00:00.000Z",
        "updatedAt": "2024-12-01T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:3000/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

**Resposta:**

```json
{
    "user": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "João Silva",
        "email": "joao@example.com",
        "role": "CUSTOMER",
        "isActive": true,
        "lastLogin": "2024-12-01T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Esqueci Minha Senha

```bash
curl -X POST http://localhost:3000/v1/user/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com"
  }'
```

**Resposta:**

```json
{
    "message": "Email de recuperação enviado com sucesso"
}
```

### 4. Reset de Senha

```bash
curl -X POST http://localhost:3000/v1/user/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "newPassword": "novaSenha123"
  }'
```

**Resposta:**

```json
{
    "message": "Senha alterada com sucesso"
}
```

## 👤 Gestão de Perfil

### 5. Obter Perfil do Usuário

```bash
curl -X GET http://localhost:3000/v1/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Resposta:**

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "João Silva",
    "email": "joao@example.com",
    "cpf": "123.456.789-00",
    "phone": "(11) 99999-9999",
    "birthDate": "1990-01-01",
    "gender": "MALE",
    "role": "CUSTOMER",
    "isActive": true,
    "emailVerified": false,
    "phoneVerified": false,
    "lastLogin": "2024-12-01T10:30:00.000Z",
    "address": {
        "street": "Rua das Flores",
        "number": "123",
        "complement": "Apto 45",
        "neighborhood": "Centro",
        "city": "São Paulo",
        "state": "SP",
        "zipCode": "01234-567",
        "country": "Brasil"
    },
    "preferences": {
        "language": "pt-BR",
        "notifications": {
            "email": true,
            "sms": false,
            "push": true
        },
        "theme": "light"
    },
    "marketingConsent": true,
    "newsletterSubscription": false,
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:30:00.000Z"
}
```

### 6. Atualizar Perfil

```bash
curl -X PUT http://localhost:3000/v1/user/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Santos",
    "phone": "(11) 88888-8888",
    "address": {
      "street": "Avenida Paulista",
      "number": "1000",
      "complement": "Sala 100",
      "neighborhood": "Bela Vista",
      "city": "São Paulo",
      "state": "SP",
      "zip_code": "01310-100",
      "country": "Brasil"
    },
    "preferences": {
      "language": "pt-BR",
      "notifications": {
        "email": true,
        "sms": true,
        "push": false
      },
      "theme": "dark"
    }
  }'
```

### 7. Alterar Senha

```bash
curl -X PUT http://localhost:3000/v1/user/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "123456",
    "newPassword": "novaSenha123"
  }'
```

**Resposta:**

```json
{
    "message": "Senha alterada com sucesso"
}
```

## 👨‍💼 Administração

### 8. Listar Usuários (Admin)

```bash
curl -X GET "http://localhost:3000/v1/user/?page=1&limit=10&role=CUSTOMER&is_active=true" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Resposta:**

```json
{
    "data": [
        {
            "id": "550e8400-e29b-41d4-a716-446655440001",
            "name": "João Silva",
            "email": "joao@example.com",
            "role": "CUSTOMER",
            "isActive": true,
            "emailVerified": false,
            "createdAt": "2024-12-01T10:00:00.000Z"
        },
        {
            "id": "550e8400-e29b-41d4-a716-446655440002",
            "name": "Maria Santos",
            "email": "maria@example.com",
            "role": "CUSTOMER",
            "isActive": true,
            "emailVerified": true,
            "createdAt": "2024-12-01T11:00:00.000Z"
        }
    ],
    "meta": {
        "total": 2,
        "page": 1,
        "limit": 10
    }
}
```

### 9. Buscar Usuário por ID (Admin)

```bash
curl -X GET http://localhost:3000/v1/user/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 10. Atualizar Usuário (Admin)

```bash
curl -X PUT http://localhost:3000/v1/user/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "role": "SELLER",
    "is_active": true,
    "email_verified": true
  }'
```

### 11. Desativar Usuário (Admin)

```bash
curl -X DELETE http://localhost:3000/v1/user/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 🔍 Filtros Disponíveis

### Listagem com Filtros

```bash
# Filtrar por role
GET /v1/user/?role=CUSTOMER

# Filtrar por status ativo
GET /v1/user/?is_active=true

# Buscar por nome ou email
GET /v1/user/?search=joão

# Paginação
GET /v1/user/?page=2&limit=5

# Combinação de filtros
GET /v1/user/?role=CUSTOMER&is_active=true&search=maria&page=1&limit=20
```

## 📝 Códigos de Status HTTP

- `200 OK` - Sucesso
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Requisição inválida
- `401 Unauthorized` - Token inválido ou ausente
- `403 Forbidden` - Acesso negado
- `404 Not Found` - Recurso não encontrado
- `422 Unprocessable Entity` - Erro de validação
- `500 Internal Server Error` - Erro interno do servidor

## 🔒 Segurança

### Headers Necessários

```bash
# Para rotas públicas
Content-Type: application/json

# Para rotas protegidas
Authorization: Bearer <token>
Content-Type: application/json
```

### Exemplo de Token JWT

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6ImpvYW9AZXhhbXBsZS5jb20iLCJpYXQiOjE3MzMxNjgwMDAsImV4cCI6MTczMzI1NDQwMH0.signature
```

## 🧪 Testes com Postman

### Collection JSON

```json
{
    "info": {
        "name": "Henrique Store - User API",
        "description": "API do microserviço de usuários"
    },
    "item": [
        {
            "name": "Auth",
            "item": [
                {
                    "name": "Register",
                    "request": {
                        "method": "POST",
                        "url": "{{baseUrl}}/v1/user/register",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n  \"name\": \"João Silva\",\n  \"email\": \"joao@example.com\",\n  \"password\": \"123456\"\n}"
                        }
                    }
                },
                {
                    "name": "Login",
                    "request": {
                        "method": "POST",
                        "url": "{{baseUrl}}/v1/user/login",
                        "header": [
                            {
                                "key": "Content-Type",
                                "value": "application/json"
                            }
                        ],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n  \"email\": \"joao@example.com\",\n  \"password\": \"123456\"\n}"
                        }
                    }
                }
            ]
        },
        {
            "name": "Profile",
            "item": [
                {
                    "name": "Get Profile",
                    "request": {
                        "method": "GET",
                        "url": "{{baseUrl}}/v1/user/profile",
                        "header": [
                            {
                                "key": "Authorization",
                                "value": "Bearer {{token}}"
                            }
                        ]
                    }
                }
            ]
        }
    ],
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:3000"
        },
        {
            "key": "token",
            "value": ""
        }
    ]
}
```

## 📚 Próximos Passos

1. **Implementar autenticação 2FA**
2. **Adicionar validação de CPF**
3. **Implementar sistema de email**
4. **Adicionar rate limiting**
5. **Implementar cache com Redis**
6. **Adicionar auditoria de ações**
7. **Implementar webhooks**
8. **Adicionar métricas**
