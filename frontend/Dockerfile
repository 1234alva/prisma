FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Host 0.0.0.0 es vital para que Docker sea accesible desde el navegador
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]