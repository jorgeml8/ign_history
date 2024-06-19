const express = require('express');
const { MongoClient } = require('mongodb');
const { parse } = require('json2csv');
const fs = require('fs');
const path = require('path');
const config = require('./config/config');

const departmentData = require('./private/departments.json');

const app = express();
const port = config.PORT;
const client = new MongoClient(config.MongoDBHost);

async function main() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (e) {
        console.error('Unable to connect to MongoDB', e);
        process.exit(1);
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/andon_report', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const csvDir = path.join(__dirname, 'public/csv_files');
if (!fs.existsSync(csvDir)) {
    fs.mkdirSync(csvDir);
}

app.get('/andon_report', (req, res) => {
    res.render('index', { issues: null, startDate: '', endDate: '', departments: departmentData });
});

app.post('/andon_report/search', async (req, res) => {
    const { startDate, endDate, department } = req.body;

    let filter = {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    };

    if (department && department !== 'all') {
        filter.department = department;
    }

    try {
        const database = client.db(config.MongoDBName);
        const collection = database.collection('andon_issues');
        const issues = await collection.find(filter).toArray();

        issues.forEach(issue => {
            const startTime = new Date(issue.startTime);
            const endTime = new Date(issue.endTime);
            issue.timeDiff = Math.abs(endTime - startTime) / 60000;
        });

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            res.render('partials/table', { issues });
        } else {
            res.render('index', { issues, startDate, endDate, departments: departmentData });
        }
    } catch (error) {
        console.error('Error querying MongoDB', error);
        res.status(500).send('Error processing request');
    }
});

app.get('/andon_report/export', async (req, res) => {
    const { startDate, endDate, department } = req.query;

    let filter = {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }
    };

    if (department && department !== 'all') {
        filter.department = department;
    }

    try {
        const database = client.db(config.MongoDBName);
        const collection = database.collection('andon_issues');
        const issues = await collection.find(filter).toArray();

        const csv = parse(issues, { fields: Object.keys(issues[0] || {}) });
        const csvFilePath = path.join(csvDir, 'andon_issues.csv');
        fs.writeFileSync(csvFilePath, csv);
        res.download(csvFilePath, 'andon_issues.csv', (err) => {
            if (err) {
                console.error('Error downloading the file', err);
            }
            fs.unlinkSync(csvFilePath);
        });
    } catch (error) {
        console.error('Error querying MongoDB', error);
        res.status(500).send('Error processing request');
    }
});

process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});

main().catch(console.error);