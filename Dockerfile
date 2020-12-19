# TODO: switch to ubuntu@20.0.4?
FROM debian:10.5

WORKDIR /SKILL-UP-SERVER

COPY package.json ./
COPY package-lock.json ./
COPY nginx/default.conf /etc/nginx/conf.d/

RUN apt-get update \
    && apt-get install -y nano apt-utils \
    && apt-get install -y nginx \
    && apt-get install -y curl \
    # && apt-get install -y npm \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash \
    && apt-get -y install nodejs \
    && apt-get clean \
    && rm -rf /var/lib/app/lists/* /tmp/* /var/tmp/*
    # && echo "daemon off:" >> /etc/nginx/nginx-conf

RUN npm ci

EXPOSE 8080

CMD ["service nginx start", "npm start"]
