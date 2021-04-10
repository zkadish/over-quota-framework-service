# SkillUp Framework Service Server: Nginx Reverse Proxy Node Server

The SkillUp App Server contains CRUD micro service api for Frameworks which define the Sales Coach work flows.

## Development getting started

- $ nvm use 12.20.0

### Create the docker network

- $ docker network create --driver bridge skillup-network
- See if docker network has already been created
- $ docker network ls
- See network details
- $ docker network inspect skillup-network
- To delete the network and start over
- $ docker network rm skillup-network

### Build image and run docker container

- Build the nginx reverse node proxy server image
- $ docker build -t app-server:skillup-app-server . --no-cache
  
- Run the image as a standalone container on localhost
- $ docker run -v ${PWD}/server:/SKILL-UP-SERVER/server -p 8082:80 -it app-server:skillup-app-server bash
  
- Run the image as a container on a docker user defined network
- $ docker run -v ${PWD}/server:/SKILL-UP-SERVER/server -p 8082:80 --network skillup-network -it app-server:skillup-app-server bash
  
- Check if nginx is running
- $ service nginx status
- Start the nginx proxy server
- $ service nginx start
- Start node server in production mode
- $ npm start
- Start node server in development mode
- $ npm run dev
- Go to "localhost:8080"
- "Express... welcome to express... Docker, nginx and node reverse proxy running..."

### Build image and run docker container with docker-compose

- Build and run mongo and mongo-express
- $ docker-compose up --build --force-recreate --remove-orphans

- Connect to the mongo db with a terminal
- docker exec -it {container} bash

- open skillup-app-server in the browser for a quick health check
- http://localhost:8080