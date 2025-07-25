# Microserviço de Usuários - Henrique Store

Este é o microserviço de usuários para o e-commerce Henrique Store, baseado na arquitetura de microserviços.

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

```
app/
├── api/v1/
│   ├── base/           # Classes base (Controller, Service, etc.)
│   └── business/       # Lógica de negócio específica
│       └── user/       # Microserviço de usuários
├── main/              # Configuração da aplicação
└── utils/             # Utilitários
```

## 🚀 Funcionalidades do Microserviço de Usuários

### Autenticação e Autorização

- ✅ Registro de usuários
- ✅ Login com JWT
- ✅ Recuperação de senha
- ✅ Alteração de senha
- ✅ Verificação de email/telefone

### Gestão de Perfil

- ✅ Visualização de perfil
- ✅ Atualização de dados pessoais
- ✅ Gestão de endereços
- ✅ Preferências do usuário

### Administração

- ✅ Listagem de usuários com filtros
- ✅ Busca por nome/email
- ✅ Ativação/desativação de usuários
- ✅ Gestão de roles (ADMIN, CUSTOMER, SELLER)

## 📋 Endpoints da API

### Rotas Públicas

```
POST /v1/user/register          # Registro de usuário
POST /v1/user/login             # Login
POST /v1/user/forgot-password   # Esqueci minha senha
POST /v1/user/reset-password    # Reset de senha
```

### Rotas Protegidas

```
GET  /v1/user/profile           # Obter perfil do usuário
PUT  /v1/user/profile           # Atualizar perfil
PUT  /v1/user/change-password   # Alterar senha
```

### Rotas Administrativas

```
GET    /v1/user/                # Listar usuários
GET    /v1/user/:id             # Obter usuário por ID
PUT    /v1/user/:id             # Atualizar usuário
DELETE /v1/user/:id             # Desativar usuário
```

## 🗄️ Modelo de Dados

### Tabela Users

```sql
- id (UUID, PK)
- name (STRING, NOT NULL)
- email (STRING, UNIQUE, NOT NULL)
- password (STRING, NOT NULL)
- cpf (STRING, UNIQUE)
- phone (STRING)
- birth_date (DATE)
- gender (ENUM: MALE, FEMALE, OTHER)
- role (ENUM: ADMIN, CUSTOMER, SELLER)
- is_active (BOOLEAN)
- email_verified (BOOLEAN)
- phone_verified (BOOLEAN)
- last_login (DATE)
- address (JSONB)
- preferences (JSONB)
- marketing_consent (BOOLEAN)
- newsletter_subscription (BOOLEAN)
- external_id (STRING)
- integration_source (STRING)
- created_by (UUID)
- updated_by (UUID)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔧 Configuração

### Variáveis de Ambiente

```env
NODE_ENV=development
PORT_SERVER=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=henrique_store_users
DB_USER=postgres
DB_PASS=postgres
DB_DIALECT=postgres
DB_LOGGING=false

# Security
SESSION_SECRET=your-super-secret-session-key
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
JWT_ISSUER=henrique-store-users-api
JWT_AUDIENCE=henrique-store-users
```

### Instalação e Execução

1. **Instalar dependências**

```bash
npm install
```

2. **Configurar banco de dados**

```bash
# Copiar arquivo de ambiente
cp env.sample .env

# Executar migrations
npm run migrate

# Executar seeders (opcional)
npm run seed
```

3. **Executar em desenvolvimento**

```bash
npm run dev
```

4. **Executar testes**

```bash
npm test
```

## 🧪 Testes

O projeto inclui testes unitários e de integração:

```bash
# Todos os testes
npm test

# Apenas testes unitários
npm run test:unit

# Apenas testes de integração
npm run test:integration

# Cobertura de código
npm run coverage
```

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ JWT para autenticação
- ✅ Validação de entrada com Joi
- ✅ Headers de segurança com Helmet
- ✅ CORS configurado
- ✅ Rate limiting (pode ser implementado)
- ✅ Sanitização de dados

## 📊 Monitoramento

- ✅ Logs estruturados com Pino
- ✅ Tratamento de erros centralizado
- ✅ Health check endpoint
- ✅ Graceful shutdown

## 🚀 Deploy

### Docker

```bash
# Construir imagem
docker build -t henrique-store-users .

# Executar container
docker run -p 3000:3000 henrique-store-users
```

### Docker Compose

```bash
docker-compose up -d
```

## 📈 Próximos Passos

- [ ] Implementar sistema de email para recuperação de senha
- [ ] Adicionar autenticação 2FA
- [ ] Implementar rate limiting
- [ ] Adicionar cache com Redis
- [ ] Implementar auditoria de ações
- [ ] Adicionar validação de CPF
- [ ] Implementar integração com provedores OAuth (Google, Facebook)
- [ ] Adicionar métricas com Prometheus
- [ ] Implementar webhooks para eventos de usuário

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
