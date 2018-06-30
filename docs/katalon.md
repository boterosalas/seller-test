#### **Pruebas e2e con Katalon**


1. Instalar python, instalar selenium module

`pip install selenium`

or depending on your permissions:

`sudo pip install selenium` ó `pip install -U selenium`

2. Instalar geckodriver. es un driver que se emplea para poder desplegar el navegador `brew install geckodriver`
3. Dar permisos para emplear el archivo geckodriver ubicado en la carpeta `usr/local/bin`: `sudo chmod 777 /usr/local/bin/geckodriver`

###### **Uso de katalon**

Se empleara python para ejecutar las pruebas e2e, python emplea un archivo con el formato `.py`  este archivo lo podemos exportar desde katalon y ejecutarlo por medio de la terminal. 

1. Exportar el archivo `.py` desde katalon. 
2. Ejecutar una sola prueba: `python file.py`
3. Ejecutar todos los archivos dentro de una carpeta:
 `for f in *.py; do python "$f"; done`