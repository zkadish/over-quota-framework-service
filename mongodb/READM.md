# Docker Commands

- $ docker build -t ubuntu:mongodb . <!-- build image from Dockerfile -->
- $ docker-compose build --no-cache
- $ docker-compose up --build --force-recreate <!-- build image from Dockerfile and docker-compose.yml -->
<!-- - $ docker run -v ${PWD}:/app -p 27017:27017 -it debian:mongodb bash -->
- $ docker run -p 27017:27017 -it mongo:4.4.2 bash
- $ mongod --bind_ip 0.0.0.0 &
- $ mongo <!-- start the mongo cli -->
