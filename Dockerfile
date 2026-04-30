FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY recipes.js recipes.test.js ./

EXPOSE 3000

CMD ["node", "backend/server.js"]
