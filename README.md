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
   
1. **Construye y levanta los contenedores**:
  ```bash
   docker-compose up --build -d
