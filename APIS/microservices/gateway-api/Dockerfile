# apis/microservices/gateway-api/Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

# Installation des dépendances selon l'environnement
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm ci --only=production; \
    else npm install; \
    fi

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]