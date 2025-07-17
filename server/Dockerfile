FROM node:22

WORKDIR /app

# Only copy package files first to cache layers
COPY package*.json ./

# Install deps INSIDE the container
RUN npm install

# Then copy the rest of the source code
COPY . .

# Optional: build if needed
RUN npm run build 

EXPOSE 3001

CMD ["npm", "start"]