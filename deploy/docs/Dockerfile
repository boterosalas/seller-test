FROM node:9.7.1

WORKDIR /app

ADD dist/. .

RUN npm -g install http-server

EXPOSE 80

CMD ['http-server']