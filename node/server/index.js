const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const api = require('./routes/router');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(__dirname + '/../client/public'));
app.use('/todo', api);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../client/index.html'));
});

app.listen(8080);
