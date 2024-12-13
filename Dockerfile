# Base Image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (si existe)
COPY package*.json .

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
