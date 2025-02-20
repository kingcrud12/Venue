# Guide de Développement des Microservices - Venues microservices documentation

## 📋 Table des Matières
1. [Environnement de Développement](#environnement-de-développement)
2. [Gateway API](#gateway-api)
3. [Auth Service](#auth-service)
4. [User Service](#user-service)
5. [Post Service](#post-service)
6. [Social Service](#social-service)
7. [Notification Service](#notification-service)

## Environnement de Développement

### Docker Setup

* **docker-compose.yml**
```yaml
version: '3.8'

services:
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes

  postgres:
    image: postgres:13
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: password
      POSTGRES_DB: konekt
    volumes:
      - postgres-data:/var/lib/postgresql/data

  adminer:
    image: adminer
    ports:
      - "8080:8080"

volumes:
  redis-data:
  postgres-data:
```

### Scripts de développement

* **package.json (racine)**
```json
{
  "scripts": {
    "start:dev": "docker-compose up -d && npm run dev:all",
    "dev:all": "concurrently \"npm run dev:gateway\" \"npm run dev:auth\" \"npm run dev:user\"",
    "dev:gateway": "cd gateway-api && npm run start:dev",
    "dev:auth": "cd auth-service && npm run start:dev",
    "dev:user": "cd user-service && npm run start:dev"
  }
}
```

## Gateway API

### 1. Installation

```bash
# Création du projet
nest new gateway-api

# Installation des dépendances
cd gateway-api
npm install @nestjs/microservices @nestjs/config @nestjs/swagger
npm install redis ioredis class-validator class-transformer
```

### 2. Structure du Gateway

```
gateway-api/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   │   ├── auth.guard.ts
│   │   └── auth.module.ts
│   ├── proxy/
│   │   ├── proxy.module.ts
│   │   └── proxy.service.ts
│   └── common/
│       ├── filters/
│       └── interceptors/
├── test/
└── package.json
```

### 3. Configuration

* **app.module.ts**
```typescript
@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { port: 3001 }
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { port: 3002 }
      }
    ])
  ]
})
export class AppModule {}
```

## Auth Service

### 1. Installation

```bash
# Création du service
nest new auth-service

# Dépendances
cd auth-service
npm install @nestjs/passport passport-jwt jwks-rsa @auth0/auth0-spa-js
npm install @nestjs/microservices redis ioredis
```

### 2. Structure Auth Service

```
auth-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   └── config/
│       └── auth0.config.ts
├── test/
└── package.json
```

### 3. Configuration Auth0

* **auth0.config.ts**
```typescript
export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE
};
```

## User Service

### 1. Installation

```bash
# Création du service
nest new user-service

# Dépendances
cd user-service
npm install @prisma/client @nestjs/microservices
npm install -D prisma
```

### 2. Configuration Prisma

* **schema.prisma**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String    @id @default(uuid())
  auth0Id           String    @unique
  email             String    @unique
  username          String    @unique
  profilePictureUrl String?
  bio               String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

### 3. Structure User Service

```
user-service/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   └── prisma/
│       └── prisma.service.ts
├── prisma/
│   └── schema.prisma
├── test/
└── package.json
```

## Redis Integration

### 1. Service Redis

* **redis.service.ts**
```typescript
@Injectable()
export class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD
    });
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.client.set(
      key,
      JSON.stringify(value),
      'EX',
      ttl || 3600
    );
  }

  async get(key: string): Promise<any> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }
}
```

### 2. Configuration Redis dans chaque service

* **.env**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-password
```

## Étapes de Développement

1. **Préparation de l'environnement**
   * Installer Docker et Docker Compose
   * Configurer les conteneurs Redis et PostgreSQL
   * Mettre en place les variables d'environnement

2. **Gateway API**
   * Développer les routes
   * Configurer Auth0
   * Mettre en place le rate limiting
   * Implémenter la documentation Swagger

3. **Auth Service**
   * Intégrer Auth0
   * Configurer Redis pour le cache des tokens
   * Développer les endpoints d'authentification

4. **User Service**
   * Configurer Prisma
   * Développer les endpoints CRUD
   * Intégrer avec Auth Service

5. **Tests et Documentation**
   * Tests unitaires
   * Tests d'intégration
   * Documentation API
   * Documentation technique

## Docker pour le Développement

### Dockerfile pour chaque service

* **Dockerfile**
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
```

### Docker Compose pour le développement

* **docker-compose.dev.yml**
```yaml
version: '3.8'

services:
  gateway:
    build: 
      context: ./gateway-api
      dockerfile: Dockerfile.dev
    volumes:
      - ./gateway-api:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development

  auth:
    build:
      context: ./auth-service
      dockerfile: Dockerfile.dev
    volumes:
      - ./auth-service:/app
      - /app/node_modules
    ports:
      - "3001:3001"

  user:
    build:
      context: ./user-service
      dockerfile: Dockerfile.dev
    volumes:
      - ./user-service:/app
      - /app/node_modules
    ports:
      - "3002:3002"
```

## Variables d'Environnement

### Gateway API
```env
PORT=3000
AUTH_SERVICE_URL=tcp://auth:3001
USER_SERVICE_URL=tcp://user:3002
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-audience
```

### Auth Service
```env
PORT=3001
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
REDIS_HOST=redis
REDIS_PORT=6379
```

### User Service
```env
PORT=3002
DATABASE_URL=postgresql://user:password@postgres:5432/konekt
REDIS_HOST=redis
REDIS_PORT=6379
```