FROM node:14

RUN mkdir -p /app/backend
WORKDIR  /app/backend

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000

CMD ["npm", "start"]
