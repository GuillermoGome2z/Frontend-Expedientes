# Frontend Dockerfile (Vite + React + TypeScript)
FROM node:20-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache git

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Comando por defecto (puede ser sobrescrito en docker-compose)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
