# Use Node.js
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY . .

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]