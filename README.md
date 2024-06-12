# Andon Report

## Descripción

Andon Report es una aplicación Node.js que facilita la gestión y visualización de incidentes de producción. La aplicación se ejecuta dentro de un contenedor Docker y utiliza Nginx como proxy inverso para redirigir el tráfico a la aplicación en la ruta `/andon_report`. La aplicación se conecta a una base de datos MongoDB para almacenar y recuperar datos de incidentes, y ofrece funcionalidades para buscar, visualizar y exportar los reportes en formato CSV.

## Características

- **Visualización de Incidentes**: Permite ver los incidentes de producción filtrados por fecha.
- **Exportación de Datos**: Exporta los incidentes a un archivo CSV.
- **Interfaz Amigable**: Utiliza EJS para las vistas y proporciona una interfaz intuitiva.
- **Despliegue con Docker**: Facilita el despliegue utilizando Docker y Docker Compose.
- **Integración con Nginx**: Usa Nginx como proxy inverso para gestionar las solicitudes.

## Tecnologías Utilizadas

- **Node.js**: Plataforma principal para la ejecución de la aplicación.
- **Express.js**: Framework para la construcción de la API y manejo de rutas.
- **MongoDB**: Base de datos NoSQL para almacenamiento de incidentes.
- **EJS**: Motor de plantillas para renderizar vistas en el servidor.
- **Docker**: Contenerización de la aplicación para un despliegue fácil y reproducible.
- **Nginx**: Proxy inverso para redirigir el tráfico HTTP a la aplicación Node.js.

## Prerrequisitos

- **Docker**: Asegúrate de tener Docker y Docker Compose instalados.
- **Node.js**: Para desarrollo local, asegúrate de tener Node.js instalado.

## Instalación y Despliegue

### Despliegue con Docker

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/tu-usuario/andon_report.git
   cd andon_report
   
2. **Construye y levanta los contenedores**:
  ```bash
   docker-compose up --build -d

3. **Accede a la aplicación**:

-La aplicación estará disponible en http://localhost/andon_report.

### Despliegue con Docker
- Asegúrate de tener el siguiente archivo de configuración para Nginx:
 ```bash
         server {
       listen 80;

       location /andon_report {
        proxy_pass http://andon_report:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
          }
      }
### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno en tu archivo de configuración o directamente en Docker Compose:
-NODE_ENV: Entorno de ejecución (DEV, UAT, PROD).
-MongoDBHost: URL de la base de datos MongoDB.
-MongoDBName: Nombre de la base de datos MongoDB.

### Variables de Entorno
Asegúrate de configurar las siguientes variables de entorno en tu archivo de configuración o directamente en Docker Compose:

-NODE_ENV: Entorno de ejecución (DEV, UAT, PROD).
-MongoDBHost: URL de la base de datos MongoDB.
-MongoDBName: Nombre de la base de datos MongoDB.

1. **Buscar Incidentes**:

-Accede a la página principal.
-Selecciona las fechas de inicio y fin.
-Haz clic en "Buscar".

2. **Exportar Incidentes a CSV**:
-Después de buscar los incidentes, haz clic en "Exportar".
-Se descargará un archivo CSV con los datos filtrados.

###Contribución

1.Fork el repositorio.
2. Crea una rama para tus cambios (git checkout -b feature/nueva-funcionalidad).
3. Confirma tus cambios (git commit -m 'Añadir nueva funcionalidad').
4. Empuja a la rama (git push origin feature/nueva-funcionalidad).
5. Abre un Pull Request.
### Subir los archivos a GitHub

1. **Añade los archivos modificados**:

   ```bash
   git add README.md DETAILS.md LICENSE

2. **Haz un commit de los cambios**:
 ```bash
      git commit -m "Update README and add DETAILS with project description and license link"

3. **Empuja los cambios al repositorio remoto**:
 ```bash
      git push origin main

Licencia
Este proyecto está bajo la licencia MIT. Ver el archivo LICENSE para más detalles.

Contacto
Para cualquier consulta o sugerencia, puedes contactarme en jorge.malopez@gmail.com
