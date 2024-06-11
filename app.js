const express = require('express');
const { MongoClient } = require('mongodb');
const { parse } = require('json2csv');
const fs = require('fs');
const path = require('path');
//const config = require('./config/config');
const config = require('/usr/src/app/config/config.js');

const app = express();
const port = config.PORT;

const client = new MongoClient(config.MongoDBHost, { useNewUrlParser: true, useUnifiedTopology: true });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Crear el directorio 'csv_files' si no existe
const csvDir = path.join(__dirname, 'public/csv_files');
if (!fs.existsSync(csvDir)) {
  fs.mkdirSync(csvDir);
}

app.get('/', (req, res) => {
  res.render('index', { issues: null, startDate: '', endDate: '' });
});

app.post('/search', async (req, res) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return res.render('index', { issues: null, startDate: '', endDate: '', error: 'Please provide startDate and endDate' });
  }

  try {
    await client.connect();
    const database = client.db(config.MongoDBName);
    const collection = database.collection('andon_issues');

    const filter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
    const issues = await collection.find(filter).toArray();

    // Calcular la diferencia de tiempo en minutos para cada registro
    issues.forEach(issue => {
      const startTime = new Date(issue.startTime);
      const endTime = new Date(issue.endTime);
      const timeDiff = Math.abs(endTime - startTime) / 60000; // Diferencia en minutos
      issue.timeDiff = timeDiff;
    });

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.render('partials/table', { issues });
    } else {
      res.render('index', { issues, startDate, endDate });
    }
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.status(500).render('partials/table', { issues: [] });
    } else {
      res.status(500).render('index', { issues: null, startDate, endDate, error: 'Internal Server Error' });
    }
  } finally {
    await client.close();
  }
});


app.get('/export', async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.render('index', { issues: null, startDate: '', endDate: '', error: 'Please provide startDate and endDate' });
  }

  try {
    await client.connect();
    const database = client.db(config.MongoDBName);
    const collection = database.collection('andon_issues');

    const filter = { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } };
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
    console.error('Error connecting to MongoDB', error);
    res.status(500).render('index', { issues: null, startDate, endDate, error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
