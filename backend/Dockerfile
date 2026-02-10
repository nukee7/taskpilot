# Use official Node LTS
FROM node:20-alpine

# Set working directory inside container
WORKDIR /backend

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose backend port
EXPOSE 8000

# Start server
CMD ["npm", "run", "dev"]