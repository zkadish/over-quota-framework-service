# Nginx Reverse Proxy Node Server

## Build and Run Docker file Bash Commands

- $ docker build -t debian:nginx .
- $ docker run -v ${PWD}/app:/SKILL-UP-SERVER/app -p 8080:80 -it debian:nginx bash
- $ service nginx start
- $ npm start
- Go to "localhost:8080"
- "Docker, nginx and node reverse proxy running..."
