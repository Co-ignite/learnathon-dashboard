# Suggested code may be subject to a license. Learn more: ~LicenseLog:3447064373.
FROM node:20-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

