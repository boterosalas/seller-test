# Servidor Node 9
FROM node:9

RUN curl -o- -L https://yarnpkg.com/install.sh | bash
# Crear directorio de despliegue
RUN  mkdir -p /srv/deploy

# Copiamos archivos requeridos por angular cli y npm
COPY package.json /srv/

COPY angular.json /srv/

COPY api-endpoints.ts /srv/

COPY /server/. /srv/server

COPY /deploy/dist-server/. /srv/deploy/dist-server

COPY /deploy/dist/. /srv/deploy/dist

COPY tsconfig.json /srv/

COPY yarn.lock /srv/

# Se ubica en el directorio del proyecto
WORKDIR /srv

RUN yarn install

RUN ls

ENTRYPOINT ["npm","run","serve:universal"]
