FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Include Vite/Rollup's platform-specific optional dependency in Linux.
RUN npm install --include=optional
RUN npm install --no-save @rollup/rollup-linux-x64-musl

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
