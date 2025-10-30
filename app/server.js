const express = require('express');
const app = express();
const cors = require('cors');

const { exec } = require('child_process');

const dns = require('dns');

app.use(cors({ origin: "https://sslab-webappvrt1.azurewebsites.net" }));

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.get('/admin', (req, res) => {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).send("Admin password missing — please configure ADMIN_PASSWORD.");
  }
  const pw = req.query.pw;
  if (pw === ADMIN_PASSWORD) {
    res.send('Welcome admin');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.get('/', (req, res) => {
  res.send('App is running securely 🎉');
});
app.listen(process.env.PORT || 8080);
