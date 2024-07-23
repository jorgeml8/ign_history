const express = require('express');
const { parse } = require('json2csv');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const version = require('./version.json').version;
const sql = require('mssql');

const departmentData = require('./private/departments.json');

const app = express();
app.locals.version = version; // Made it available.
const port = config.PORT;

async function main() {
    try {
        await sql.connect(config.sql);
        console.log('Connected to SQL Server');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (e) {
        console.error('Unable to connect to SQL Server', e);
        process.exit(1);
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/ign_history', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const csvDir = path.join(__dirname, 'public/csv_files');
if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir);
}

app.get('/ign_history', (req, res) => {
    res.render('index', { issues: null, startDate: '', endDate: '', departments: departmentData });
});

app.post('/ign_history/search', async (req, res) => {
    const { startDate, endDate, department, table } = req.body;

    console.log('Received request with data:', { startDate, endDate, department, table });

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const formattedStartDate = startDateTime.toISOString().split('T')[0] + ' 00:00:00.000';
    const formattedEndDate = endDateTime.toISOString().split('T')[0] + ' 23:59:59.999';


    let filter = `WHERE PostTimestamp BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`;

    if (department && department !== 'all') {
        filter += ` AND TagPathName like '%${department}%'`;
    }
        const query = `SELECT TagPathName, Value, TagValueQuality, PostTimestamp, TagOrigin, DataType, TagChangeTimestamp, SPCallTimestamp, SPStartTimestamp FROM PHSIGN.${table} ${filter}`;
        console.log('Generated query:', query);

    try {
        const result = await sql.query(`SELECT TagPathName, Value, TagValueQuality, PostTimestamp, TagOrigin, DataType, TagChangeTimestamp, SPCallTimestamp, SPStartTimestamp FROM PHSIGN.${table} ${filter}`);
        const issues = result.recordset;
        console.log('Query result:', issues);

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.render('partials/table', { issues });
        } else {
            res.render('index', { issues, startDate, endDate, departments: departmentData });
        }
    } catch (error) {
        console.error('Error querying SQL Server', error);
        res.status(500).send('Error processing request');
    }
});

app.get('/sql_data', async (req, res) => {
    try {
        const result = await sql.query`SELECT TagPathName, Value, TagValueQuality, PostTimestamp, TagOrigin, DataType, TagChangeTimestamp, SPCallTimestamp, SPStartTimestamp FROM CurrentIGNValue`;
        res.render('sql_data', { data: result.recordset });
    } catch (error) {
        console.error('Error querying SQL Server', error);
        res.status(500).send('Error processing request');
    }
});

process.on('SIGINT', async () => {
    await sql.close();
    console.log('SQL Server connection closed');
    process.exit(0);
});

main().catch(console.error);
