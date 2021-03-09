FROM node:14

RUN mkdir -p /app/frontend
WORKDIR  /app/frontend

COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000

CMD ["npm", "start"]
