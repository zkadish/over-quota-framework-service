# SkillUp Application Server: Nginx Reverse Proxy Node Server

## Development getting started

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
- $ docker build -t debian:nginx .
- Run the image as a container on a docker user defined network
- $ docker run -v ${PWD}/server:/SKILL-UP-SERVER/server -p 8080:80 --network skillup-network -it debian:nginx bash
- Start the nginx proxy server
- $ service nginx start
- Start node server in production mode
- $ npm start
- Start node server in development mode
- $ npm run dev
- Go to "localhost:8080"
- "Express... welcome to express... Docker, nginx and node reverse proxy running..."
