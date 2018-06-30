# Conexión al servidor

## SSH / SFTP

Solo Admin:

    ssh -i $HOME/keys/envios-exito.pem ubuntu@ec2-34-200-30-156.compute-1.amazonaws.com

En terminal correr el siguiente comando:

    ssh -i /Users/maik/Documents/keys/seller-center.pem ubuntu@ec2-34-200-30-156.compute-1.amazonaws.com

## Producción

Datos de conección:

DNS: ec2-34-200-30-156.compute-1.amazonaws.com
usuario: ubuntu
puerto: 22
keyfile: seller-center.pem

## Para enviar a producción el sistema es necesiario conectarse al servidor remoto por un túnel ssh

Solo Admin:

    ssh -v -N -L localhost:2375:localhost:2375 -o ConnectTimeout=15 -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -i $HOME/keys/seller-center.pem -p 22 ubuntu@ec2-34-200-30-156.compute-1.amazonaws.com

abrir terminal bash y ejecutar el comando:

    ssh -v -N -L localhost:2375:localhost:2375 -o ConnectTimeout=15 -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -i /Users/maik/Documents/keys/seller-center.pem -p 22 ubuntu@ec2-34-200-30-156.compute-1.amazonaws.com

Luego en otra terminal ejecutar los siguientes commandos

    export DOCKER_HOST='tcp://127.0.0.1:2375'

Staging:

    cd ../mnt/c/Exito/Repositorio/SellerCenter/

    docker build -t front-stageg .

    docker run -d -p 8080:4000 front-stageg

Prod:

## Useful Docker Commands (use with care)

- View docker images
```
docker images
```
- List actively running images (add -l to include stopped containers)
```
docker ps
```
- View container logs
```
docker logs -f <containerID>
```
- Stop container
```
docker stop <containerID>
```
- Delete dead images
```
for i in `docker images|grep \<none\>|awk '{print $3}'`;do docker rmi $i;done
```
- Delete containers
```
docker rm -f `docker ps --no-trunc -a -q`
```
- Console ftp
```
docker exec -t -i <CONTAINER ID> bash
```
- Copy log files
```
docker cp f06a9633849d:/var/log src/logs/

- Docker local test
```
docker build -t testseller .
docker run -d -p 4000:4000 testseller

## Configurar un nuevo servidor

sudo apt-get update
   wget -qO- https://get.docker.com/ | sh
   docker -v

   sudo nano /etc/default/docker
   -- no recomendable en prod

   #DOCKER_OPTS="-H tcp://127.0.0.1:2375 --dns 8.8.8.8 --dns 8.8.4.4"
   DOCKER_OPTS="-H tcp://127.0.0.1:2375"

   sudo service docker stop
   sudo service docker start





### Despliegue con el proyecto ya compilado y empleando yarn para instalar dependencias

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




## Configuración para Angular universal, esta configuración de docker permite subir los recursos de angular y realizar el build en en server

#FROM nginx

#ADD dist/. /usr/share/nginx/html

#EXPOSE 80

# Servidor Node 9
FROM node:9

# Crear directorio de despliegue
RUN  mkdir -p /srv/deploy

# Copiar código fuente
COPY src/. /srv/src/

# Copiamos archivos requeridos por angular cli y npm
COPY package.json /srv/

COPY angular.json /srv/

COPY api-endpoints.ts /srv/

COPY /server/. /srv/server

COPY tsconfig.json /srv/

# Se ubica en el directorio del proyecto
WORKDIR /srv

# Instalamos librerías requeridas
RUN npm install -g @angular/cli --unsafe-perm

RUN ls
# Instalamos los módulos
RUN npm install --unsafe-perm

RUN npm run build:universal

ENTRYPOINT ["npm","run","serve:universal"]

EXPOSE 4000

USER node