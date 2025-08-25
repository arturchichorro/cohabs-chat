FROM node:22-alpine3.20 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3035
CMD ["npm", "start"]
