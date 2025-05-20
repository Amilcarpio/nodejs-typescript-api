FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV=development
ENV PORT=3000

RUN npm run format:check
RUN npm run lint

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]