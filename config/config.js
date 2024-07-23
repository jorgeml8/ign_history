module.exports = {
    PORT: 3000,
    sql: {
        user: 'IGN_SL3_RO_PRD',
        password: '7w!p3WJ4NcjVr@qp',
        server: 'raqsqlstdprd01v.mcquay.com',
        database: 'AMS_SL3_PRD_IGN',
        options: {
            encrypt: true, // Si usas Azure SQL o necesitas encriptar la conexión
            trustServerCertificate: true // Cambia según sea necesario
        }
    }
};
