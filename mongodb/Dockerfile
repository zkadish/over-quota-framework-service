FROM mongo:4.4.2

# custom label for the docker image
# LABEL version="0.1" maintainer="ObjectRocket"

# use 'RUN' to execute commands in the container's bash terminal
# RUN apt-get update -y

# Define default command.
RUN mkdir -p ./data/db

# RUN service mongodb start -y
# CMD ["mongod --bind_ip 0.0.0.0", "mongo"]

# Expose ports.
#   - 27017: process
#   - 28017: http
EXPOSE 27017
# EXPOSE 28017