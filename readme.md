# Konekt - Plateforme de Bons Plans Sociale

## 📑 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Microservices](#microservices)
4. [Auth0 Integration](#auth0-integration)
5. [Redis Integration](#redis-integration)
6. [Installation](#installation)
7. [Développement](#développement)

## Vue d'ensemble

Konekt est une plateforme sociale de partage de bons plans permettant aux utilisateurs de découvrir et partager des recommandations authentiques.

### 🎯 Objectifs

* **Connexion sociale**
  * Suivre des amis et des personnes partageant les mêmes centres d'intérêt
  * Faciliter le partage d'expériences positives

* **Qualité du contenu**
  * Recommandations authentiques et détaillées
  * Système de validation communautaire

* **Engagement utilisateur**
  * 10,000 utilisateurs actifs dans la première année
  * Taux d'engagement de 40%

### 👥 Public cible

* **Démographie principale**
  * Âge : 25-45 ans
  * CSP+ et CSP intermédiaire
  * Urbains et péri-urbains

* **Centres d'intérêt**
  * Découverte de nouvelles expériences
  * Partage social
  * Économies intelligentes
  * Consommation locale

## Architecture

### Structure du projet

* **Gateway API (Port 3000)**
  * Point d'entrée unique
  * Routage des requêtes
  * Authentification globale
  * Rate limiting

* **Auth Service (Port 3001)**
  * Intégration Auth0
  * Gestion des tokens
  * Vérification des permissions

* **User Service (Port 3002)**
  * Gestion des profils
  * Préférences utilisateurs
  * Données non-sensibles

* **Post Service (Port 3003)**
  * Gestion des bons plans
  * Catégorisation
  * Géolocalisation

* **Social Service (Port 3004)**
  * Gestion des follows/followers
  * Likes et commentaires
  * Interactions sociales

* **Notification Service (Port 3005)**
  * Notifications push
  * Emails
  * Alertes en temps réel

### Flux de données

* **Authentification**
  1. Client envoie une demande de connexion au Gateway
  2. Gateway transmet à Auth Service
  3. Auth Service vérifie avec Auth0
  4. Token JWT retourné au client
  5. Token stocké dans Redis

* **Création de post**
  1. Client envoie le post au Gateway
  2. Gateway vérifie le token avec Auth Service
  3. Post Service crée l'entrée
  4. Événement publié dans Redis
  5. Notification Service alerte les followers

## Microservices

### Gateway API

* **Configuration**
  ```typescript
  // app.module.ts
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      { name: 'AUTH_SERVICE', transport: Transport.TCP, options: { port: 3001 } },
      { name: 'USER_SERVICE', transport: Transport.TCP, options: { port: 3002 } },
      { name: 'POST_SERVICE', transport: Transport.TCP, options: { port: 3003 } }
    ])
  ]
  ```

* **Variables d'environnement**
  ```env
  PORT=3000
  AUTH_SERVICE_URL=tcp://localhost:3001
  USER_SERVICE_URL=tcp://localhost:3002
  POST_SERVICE_URL=tcp://localhost:3003
  ```

### Auth Service

* **Configuration Auth0**
  ```env
  AUTH0_DOMAIN=your-domain.auth0.com
  AUTH0_CLIENT_ID=your-client-id
  AUTH0_CLIENT_SECRET=your-client-secret
  AUTH0_AUDIENCE=your-api-identifier
  ```

* **Redis Configuration**
  ```env
  REDIS_HOST=localhost
  REDIS_PORT=6379
  REDIS_PASSWORD=your-password
  ```

### User Service

* **Configuration Base de données**
  ```env
  DATABASE_URL=postgresql://user:password@localhost:5432/user_db
  ```

* **Schema Prisma**
  ```prisma
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

## Auth0 Integration

### Configuration Dashboard

* **Étape 1: Création Application**
  * Accéder au Dashboard Auth0
  * Applications > Create Application
  * Sélectionner "Regular Web Application"

* **Étape 2: Configuration URLs**
  * Allowed Callback URLs: http://localhost:3000/callback
  * Allowed Logout URLs: http://localhost:3000
  * Allowed Web Origins: http://localhost:3000

* **Étape 3: API Configuration**
  * Créer une nouvelle API
  * Définir l'identifiant
  * Configurer les scopes

## Redis Integration

### Configuration

* **Installation Redis**
  * Installer Redis Server
  * Configurer la persistance
  * Définir le mot de passe

* **Configuration Service**
  ```env
  REDIS_HOST=localhost
  REDIS_PORT=6379
  REDIS_PASSWORD=your-password
  ```

## Installation

### Prérequis

* Node.js (v14+)
* Docker & Docker Compose
* PostgreSQL
* Redis

### Installation pas à pas

1. **Cloner le repository**
   * git clone https://github.com/your-username/konekt.git
   * cd konekt

2. **Configurer l'environnement**
   * Copier .env.example vers .env
   * Remplir les variables d'environnement

3. **Installer les dépendances**
   * Installer dans gateway-api
   * Installer dans auth-service
   * Installer dans user-service
   * Installer dans chaque service

4. **Lancer les services**
   * Démarrer Redis
   * Démarrer PostgreSQL
   * Lancer chaque service

## Développement

### Mode développement

* **Gateway API**
  * cd gateway-api
  * npm run start:dev

* **Auth Service**
  * cd auth-service
  * npm run start:dev

* **User Service**
  * cd user-service
  * npm run start:dev

### Tests

* **Tests unitaires**
  * npm run test

* **Tests e2e**
  * npm run test:e2e

* **Tests d'intégration**
  * npm run test:integration

# Architecture et Flux de Données

## 🏗 Architecture Globale

```
                                   ┌──────────────────┐
                                   │                  │
                                   │     Auth0        │
                                   │                  │
                                   └────────┬─────────┘
                                           │
                                           ▼
┌──────────────┐               ┌──────────────────┐
│              │               │                  │
│   Client     │ ◄────────────►│   Gateway API   │
│  Web/Mobile  │               │    (3000)       │
│              │               │                  │
└──────────────┘               └───────┬──────────┘
                                      │
                                      ▼
                              ┌──────────────┐
                              │             │
                              │    Redis    │
                              │             │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼───────────────┐
                    │                │               │
                    ▼                ▼               ▼
         ┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
         │   Auth Service   │ │ User Service │ │ Post Service │
         │     (3001)      │ │    (3002)    │ │    (3003)    │
         └───────┬─────────┘ └──────┬───────┘ └──────┬───────┘
                 │                   │               │
                 ▼                   ▼               ▼
         ┌──────────────┐    ┌──────────────┐ ┌──────────────┐
         │  Auth DB     │    │   User DB    │ │   Post DB    │
         └──────────────┘    └──────────────┘ └──────────────┘
```

## 🔄 Flux de Données

### 1. Flux d'Authentification

```
┌──────────┐     ┌───────────┐    ┌─────────────┐    ┌───────┐
│          │ (1) │           │(2) │             │(3) │       │
│  Client  ├────►│  Gateway  ├───►│ Auth Service├───►│ Auth0 │
│          │     │           │    │             │    │       │
└──────────┘     └───────────┘    └─────────────┘    └───┬───┘
     ▲                                                    │
     │                                                   │(4)
     │               ┌───────┐         (5)               │
     └───────────────┤ Redis ◄─────────────────────────┘
         (7)         └───────┘
```

1. Client envoie credentials
2. Gateway route vers Auth Service
3. Auth Service vérifie avec Auth0
4. Auth0 valide et renvoie token
5. Token stocké dans Redis
6. Token renvoyé au Client

### 2. Flux de Création de Post

```
┌──────────┐    ┌───────────┐    ┌─────────────┐    ┌──────────┐
│          │(1) │           │(2) │             │(3) │          │
│  Client  ├───►│  Gateway  ├───►│ Auth Service├───►│  Redis   │
│          │    │           │    │             │    │          │
└──────────┘    └─────┬─────┘    └─────────────┘    └──────┬───┘
                      │                                     │
                      │(4)         ┌─────────────┐         │
                      └──────────►│ Post Service │◄────────┘
                                 └──────┬────────┘    (5)
                                       │
                                       ▼(6)
                                 ┌────────────┐
                                 │  Post DB   │
                                 └────────────┘
```

1. Client envoie nouveau post
2. Gateway vérifie authentification
3. Token vérifié dans Redis
4. Données transmises au Post Service
5. Événement publié dans Redis
6. Post sauvegardé en DB

### 3. Communication Inter-Services

```
┌─────────────┐                              ┌─────────────┐
│             │◄─────── TCP/HTTP ───────────►│             │
│ Service A   │                              │ Service B   │
│             │                              │             │
└─────┬───────┘                              └─────┬───────┘
      │                                            │
      │              ┌──────────┐                 │
      └─────────────►│  Redis   │◄────────────────┘
     Event Publish   │          │   Event Subscribe
                    └──────────┘
```

- Communication synchrone : TCP/HTTP
- Communication asynchrone : Redis Pub/Sub
- Cache partagé : Redis

## 🔐 Sécurité des Communications

- Tous les endpoints protégés par Auth0
- Communications inter-services via tokens JWT
- Cache des tokens dans Redis
- Rate limiting au niveau Gateway
- HTTPS obligatoire en production