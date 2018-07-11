# **Éxito Seller Center Web**

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli)
 version 1.6.1.

## Empezando

1. Ir a la carpeta del proyecto e instalar dependencias:
 ```bash
 npm install
 ```
- Tambien con:
 ```bash
 yarn install
 ```

2. Inicie el servidor de desarrollo y abra `localhost:4200` en su navegador:
 ```bash
 npm start
 ```
 
## Estructura del proyecto

```
ACTUALIZAR
```

## Tareas principales

La automatización de tareas se basa en [NPM scripts](https://docs.npmjs.com/misc/scripts) y se usa [npm-run-all](https://github.com/mysticatea/npm-run-all) una herramienta CLI para ejecutar múltiples npm-scripts en paralelo o secuencial.

Tarea                           | Descripción
--------------------------------|--------------------------------------------------------------------------------------
`npm start`                     | Ejecute el servidor de desarrollo en `http://localhost:4200/`
`npm development`               | Ejecute el servidor de prueba en `http://localhost:4200/` y las url de la api apuntando a `http://localhost:3000/`
`npm run json-server`           | Ejecute el servidor de prueba en `http://localhost:3000/`
`npm run build`                 | Verificar el código y construir la app para producción (con [AOT](https://angular.io/guide/aot-compiler)) en la carpeta `deploy/`
`npm test`                      | Ejecute las pruebas unitarias via [Karma](https://karma-runner.github.io) en watch mode
`npm run test:ci`               | Se verificar el código y se ejecutar las pruebas unitarias para integración continua
`npm run e2e`                   | Ejecute pruebas e2e usando [Protractor](http://www.protractortest.org)
`npm run lint`                  | Verificar el código
`npm run compodoc`              | Generar documentación del proyecto
`npm run docs`                  | Mostrar documentación generada del proyecto

## Comandos Angular Universal

[Angular Universal](https://universal.angular.io/) es la herramienta de Server Side Rendering (SSR) que te permite renderizar Angular desde el servidor. Los principales beneficios de usar SSR es que facilita el posicionamiento SEO y reduce el tiempo de carga inicial de la página.

Tarea                                | Descripción
-------------------------------------|--------------------------------------------------------------------------------------
`tsc:server`                         |  Es el que compila el servidor Express siguiendo la configuración anterior.
`build:client-and-server-bundles`    |  Es el comando que compila tu app Angular para producción y usando AOT, tanto la versión de navegador como la versión de servidor.
`build:universal`                    |  Es un comando útil que se encarga de llamar a los dos comandos anteriores. Es todo cuando necesitas para preparar el SSR.
`serve:universal`                    |   Lanza el servidor Express que has creado.

Al compilar la aplicación, puede especificar el entorno de destino utilizando el indicador adicional `--env <nombre>` (no olvidar preceder con `--` para pasar argumentos a las secuencias de comandos npm).

El entorno de compilación predeterminado es `prod`.

## Servidor de desarrollo

Ejecute `npm start` para un servidor de desarrollo. Navegue a `http://localhost:4200/`. La aplicación se volverá a cargar automáticamente si cambia alguno de los archivos fuente.

## Scaffolding

Ejecute `npm run generate -- component <name>` para generar un nuevo componente. 
También puedes usar `npm run generate -- directive|pipe|service|class|module`.

Si tienes instalado [angular-cli](https://github.com/angular/angular-cli) globalmente con `npm install -g @angular/cli` o `yarn global add @angular/cli`, también puede usar el comando `ng generate` directamente.

## Herramientas adicionales

Las tareas se basan principalmente en la herramienta `angular-cli`. 
Use `ng help` para obtener más ayuda o revise [Angular-CLI README](https://github.com/angular/angular-cli).

### Herramientas

Los procesos de desarrollo, construcción y calidad se basan en [angular-cli](https://github.com/angular/angular-cli) y
[NPM scripts](https://docs.npmjs.com/misc/scripts), que incluye:

- Proceso optimizado de compilación y agrupamiento con [Webpack] (https://webpack.github.io)
- CSS entre navegadores con [autoprefixer] (https://github.com/postcss/autoprefixer) y
  [browserslist] (https://github.com/ai/browserslist)
- Revisión de asset para [mejor gestión del caché] (https://webpack.github.io/docs/long-term-caching.html)
- Pruebas unitarias usando [Jasmine] (http://jasmine.github.io) y [Karma] (https://karma-runner.github.io)
- Pruebas de extremo a extremo con [Karma] (https://github.com/angular/protractor)
- Análisis de código estático: [TSLint] (https://github.com/palantir/tslint), [Codelyzer] (https://github.com/mgechev/codelyzer),
  [StyleLint] (http://stylelint.io) y [HTMLHint] (http://htmlhint.com/)
- Servidor local para la gestión del conocimiento usando [Hads] (https://github.com/sinedied/hads) y [Compodoc] (https://compodoc.github.io/website/)

#### Guías de codificación

- [Angular](docs/coding-guides/angular.md)
- [TypeScript](docs/coding-guides/typescript.md)
- [Sass](docs/coding-guides/sass.md)
- [HTML](docs/coding-guides/html.md)
- [Unit tests](docs/coding-guides/unit-test.md)
- [End-to-end tests](docs/coding-guides/e2e.md)

#### Otras documentaciones

- [Despliegue con Docker](docs/docker.md)
- [Compodoc](docs/compodoc.md)
- [Angular Doc](docs/angulardoc.md)
- [Json server](docs/json-server.md)
- [Katalon](docs/katalon.md)

### Documentación de Compodoc

- [Github](https://maik3345.github.io/Seller-center-Documentation/dist/index.html)
