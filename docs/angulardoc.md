
## Angular cli commands

ng server

* Especificar el host a angular

ng server --host=“host”

* Especificar el lenguaje

ng serve --locale 'es-CO'

* Generar el build del proyecto

ng build --prod

* Generar Build con lenguaje español

ng build --prod --locale 'es-CO'

ng build --prod --vendor-chunk --locale 'es-CO' --output dist/es

* Realizar el testing del proyecto

ng test -sm=false



#### Correr el proyecto en los ambientes creados


1. `ng server --environment stage`
2. `ng server` --> default
3. `ng server --environment prod`



## **Pruebas Unitarias**
###### Preparando entorno.

* Guía de ng test: https://github.com/angular/angular-cli/wiki/test
* Guía de protractor: https://www.protractortest.org/#/tutorial
* Instalar **http-server**, esto permitirá ejecutar un servidor local donde visualizaremos el test de coverage donde veremos los resultados de las pruebas unitarias:   `npm install -g http-server`

###### Primeros pasos.
1. para iniciar la prueba unitaria correr el comando: `ng test  - ng test -sm=false` ó `ng test --code-coverage` para preparar el reporte de las pruebas, luego de ejecutar la primera prueba unitaria podemos visualizar el reporte de las pruebas con el comando `http-server coverage` esto lanzara un servidor donde visualizaremos el reporte de las pruebas.


## **Pruebas e2e con Angular**

Los archivos empleados para las pruebas e2e se encuentran en la carpeta **e2e** del proyecto. 

para ejecutar las pruebas se emplea el comando: `ng e2e`

