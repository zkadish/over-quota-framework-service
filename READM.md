# Nginx Reverse Proxy Node Server

## Build and Run Docker file Bash Commands

- $ docker build -t debian:nginx .
- $ docker run -v ${PWD}/app:/app -p 8080:80 -it debian:nginx bash
- $ service nginx start
- $ node server.js
- Go to "localhost:8080"
- "Docker, nginx and node reverse proxy running..."
