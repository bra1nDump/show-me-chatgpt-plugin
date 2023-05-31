# Use an official Node runtime as the parent image
FROM node:18

# Set the working directory in the container to /usr/src/app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Clean cache
# RUN npm cache clean --force
# RUN npm install -g esbuild
RUN npm config set registry https://registry.npm.taobao.org

# Install any needed packages specified in package.json
RUN npm i

# Bundle app source
COPY . .

# Make port 8000 available to the world outside this container
EXPOSE 8787

# Run npm run dev when the container launches
CMD [ "npm", "run", "dev" ]
