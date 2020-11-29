# TODO: switch to ubuntu@20.0.4?
FROM debian:10.5

WORKDIR /app

COPY app/server.js /app
COPY nginx/default.conf /etc/nginx/conf.d/

RUN apt-get update \
    && apt-get install -y nano \
    && apt-get install -y nginx \
    && apt-get install -y curl \
    # && apt-get install -y npm \
    && curl -sL https://deb.nodesource.com/setup_14.x | bash \
    && apt-get -y install nodejs \
    && apt-get clean \
    && rm -rf /var/lib/app/lists/* /tmp/* /var/tmp/*
    # && echo "daemon off:" >> /etc/nginx/nginx-conf

EXPOSE 80

CMD ["nginx", "node server.js"]
