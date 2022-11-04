FROM node:18.8.0-alpine AS development
ENV NODE_ENV development

WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . .
WORKDIR /app
EXPOSE 3000

CMD [ "npm", "run", "start:docker" ]