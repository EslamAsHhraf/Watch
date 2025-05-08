# Use an official Node.js runtime as a parent image
FROM node:20

# Install dependencies for building native modules
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++

WORKDIR /usr/src/app

# Only copy package files to install dependencies
COPY package*.json ./

# Install deps and build native modules like sqlite3 from source
RUN npm install --build-from-source

# Now copy the rest of the app
COPY . .

EXPOSE 5001

CMD [ "node", "server.js" ]
