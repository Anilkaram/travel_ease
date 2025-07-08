FROM node:16-alpine

WORKDIR /app
COPY package*.json ./
COPY models ./models
COPY controllers ./controllers
COPY routes ./routes
COPY app.js ./
RUN npm install --production
EXPOSE 5000
CMD ["node", "app.js"]
