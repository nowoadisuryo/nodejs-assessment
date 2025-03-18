# Use official Node.js LTS image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application
COPY . .

# Expose port (match this with your app's port)
EXPOSE 3000

# Seed the database
RUN npm run seed

# Start the application
CMD ["npm", "start"]
