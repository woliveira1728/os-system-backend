FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN mkdir -p /app/uploads && chmod 755 /app/uploads

EXPOSE 4000

CMD ["npm", "run", "dev"]