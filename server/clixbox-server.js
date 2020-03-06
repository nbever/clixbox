const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const clixApi = require('./clixApi');
const abilityApi = require('./abilityApi');

const isNil = require('lodash/isNil');

const {initDB} = require('./init');

const app = express();
app.use(cors());
app.use(express.json());
app.use(function(err, req, resp, next) {
  resp.status(500).send(err.message);
});

mongoose.connect('mongodb://localhost:27017/clixbox', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

const db = mongoose.connection;

db.on('error', () => {
  console.log('Error connecting');
});

db.on('connected', async function() {
  console.log('DB connected');
  console.log('checking initialization state...');
  await initDB();
  console.log('DB is ready to go');
});

const upload = multer({
  dest: './images'
});

const reqHandler = async (fx, next) => {
  try {
    await fx();
  }
  catch(err) {
    next(err);
  }
};

app.post('/images', upload.single('picUpload'), async (req, resp) => {
  const suffix = req.file.originalname.split('.')[1];
  fs.renameSync(req.file.path, `${req.file.path}.${suffix}`);
  resp.json({logo: `${req.file.filename}.${suffix}`});
});

// clix
app.get('/clix', async (req, resp) => {
  const rtn = await clixApi.getClix();
  resp.json(rtn);
});

app.get('/clix/:id', async (req, resp) => {

});

app.put('/clix/:id', async (req, resp) => {

});

app.post('/clix', async (req, resp, next) => {
  reqHandler(async () => {
    const newClix = await clixApi.createClix(req.body);
    return resp.json(newClix);
  }, next);
});

app.delete('/clix/:id', async (req, resp) => {

});

// game
app.get('/games', async (req, resp) => {

});

app.get('/game/:id', async (req, resp) => {

});

app.post('/game', async (req, resp) => {

});

app.put('/game/:id', async (req, resp) => {

});

app.delete('/game/:id', async (req, resp) => {

});

app.get('/game/clix/:id', async (req, resp) => {

});

app.put('/game/clix/:id', async (req, resp) => {

});

// stuffs
app.get('/abilities', async (req, resp) => {

});

app.get('/enhancements', async (req, resp) => {

});

app.get('/keywords', async (req, resp) => {

});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});


