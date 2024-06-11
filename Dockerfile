# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.14.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

# Establecer el directorio de trabajo en /usr/src/app
WORKDIR /usr/src/app

# Copiar los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Configurar npm para ignorar SSL y establecer el registro, y luego instalar las dependencias
RUN npm config set strict-ssl false \
    && npm config set registry http://registry.npmjs.org/ \
    && npm install -g npm@10.8.1 \
    && npm install
# Instala PM2 globalmente dentro del contenedor
RUN npm install pm2 -g
# Crear el directorio 'csv_files' y establecer permisos
RUN mkdir -p /usr/src/app/public/csv_files \
    && chown -R node:node /usr/src/app/public/csv_files

# Copiar el resto del código de la aplicación al contenedor
COPY . .

# Ejecutar la aplicación como un usuario no-root
USER node

# Exponer el puerto que utiliza la aplicación
EXPOSE 3000

# Comando para ejecutar la aplicación
#CMD ["node", "index.js"]
CMD ["pm2-runtime", "start", "ecosystem.config.js"]