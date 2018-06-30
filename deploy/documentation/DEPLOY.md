# Conexión al servidor

## SSH / SFTP

Solo Admin:

    ssh -i $HOME/keys/envios-exito.pem ubuntu@ec2-54-210-36-240.compute-1.amazonaws.com

En terminal correr el siguiente comando:

    ssh -i /Users/maik/Documents/keys/seller-center.pem ubuntu@ec2-54-210-36-240.compute-1.amazonaws.com

## Producción

Datos de conección:

DNS: ec2-54-210-36-240.compute-1.amazonaws.com
usuario: ubuntu
puerto: 22
keyfile: seller-center.pem

## Para enviar a producción el sistema es necesiario conectarse al servidor remoto por un túnel ssh

Solo Admin:

    ssh -v -N -L localhost:2375:localhost:2375 -o ConnectTimeout=15 -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -i $HOME/keys/seller-center.pem -p 22 ubuntu@ec2-54-210-36-240.compute-1.amazonaws.com

abrir terminal bash y ejecutar el comando:

    ssh -v -N -L localhost:2375:localhost:2375 -o ConnectTimeout=15 -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -i /Users/maik/Documents/keys/seller-center.pem -p 22 ubuntu@ec2-54-210-36-240.compute-1.amazonaws.com

Luego en otra terminal ejecutar los siguientes commandos

    export DOCKER_HOST='tcp://127.0.0.1:2375'

Staging:

    cd ../mnt/c/Exito/Repositorio/SellerCenter/

    docker build -t front-stageg2 .

    docker run -d -p 172.31.90.112:80:4000 front-stage2

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
````
docker build -t testseller .
docker run -d -p 4000:4000 testseller