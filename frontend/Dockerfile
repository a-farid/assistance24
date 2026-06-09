# Frontend Dockerfile for Next.js development
FROM node:20-alpine

WORKDIR /app

# Install dependencies first to leverage Docker cache
COPY package.json package-lock.json* ./
RUN npm install

# Copy app source into container
COPY . .

EXPOSE 3000

# Start Next.js in development mode, listening on all interfaces
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
