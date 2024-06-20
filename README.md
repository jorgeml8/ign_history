# Andon Report

## Description

Andon Report is a Node.js application that facilitates the management and visualization of production incidents. The application runs inside a Docker container and uses Nginx as a reverse proxy to redirect traffic to the application on the `/andon_report` path. The application connects to a MongoDB database to store and retrieve incident data, and offers functionalities to search, visualize, and export reports in CSV format.

## Features

- **Incident Visualization**: Allows viewing production incidents filtered by date.
- **Data Export**: Exports incidents to a CSV file.
- **User-Friendly Interface**: Uses EJS for views and provides an intuitive interface.
- **Deployment with Docker**: Facilitates deployment using Docker and Docker Compose.
- **Integration with Nginx**: Uses Nginx as a reverse proxy to manage requests.

## Technologies Used

- **Node.js**: Main platform for running the application.
- **Express.js**: Framework for building the API and handling routes.
- **MongoDB**: NoSQL database for storing incidents.
- **EJS**: Template engine for rendering server-side views.
- **Docker**: Containerization of the application for easy and reproducible deployment.
- **Nginx**: Reverse proxy to redirect HTTP traffic to the Node.js application.

## Prerequisites

- **Docker**: Make sure you have Docker and Docker Compose installed.
- **Node.js**: For local development, make sure you have Node.js installed.

## Installation and Deployment

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/andon_report.git
   cd andon_report
   ``` 
   
2. **Build and start the containers**:
   ```bash
   docker-compose up --build -d
   ```


3. **Access the application**:

- The application will be available at http://localhost:80/andon_report.

### Deployment with Docker
- Make sure you have the following configuration file for Nginx::
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
   ```      
### Variables de Entorno

Make sure to configure the following environment variables in your configuration file or directly in Docker Compose
- **NODE_ENV: Execution environment (DEV, UAT, PROD)**.
- **MongoDBHost: URL of the MongoDB database.**.
- **MongoDBName: Name of the MongoDB database**.


1. **Incident Visualization**:

- **Access the main page.
- **Select the start and end dates.
- **Click on "Search".

2. **Export Incidents to CSV**:
- **After searching for incidents, click on "Export".
- **A CSV file with the filtered data will be downloaded.

### Contribución

1. Fork the repository.
2. Create a branch for your changes ``git checkout -b feature/new-feature``.
3. Commit your changes ``git commit -m Add new feature``
4. Push to the branch ``git push origin feature/new-feature``.
5. Open a Pull Request.
### Subir los archivos a GitHub

1. **Add the modified files**:

   ```bash
   git add README.md DETAILS.md LICENSE 
   ```
2. **Commit the changes**:
   ```bash
      git commit -m "Update README and add DETAILS with project description and license link" 
   ```
3. **Push the changes to the remote repository**:
   ```bash
      git push origin main 
   ```
Licencia
This project is licensed under the MIT License. See the [LICENSE](LICENSE)
 file for more details.


