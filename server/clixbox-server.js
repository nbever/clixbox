const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const clixApi = require('./clixApi');
const abilityApi = require('./abilityApi');
const gamesApi = require('./gamesApi');

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

app.get('/clix/:id', async (req, resp, next) => {
  reqHandler(async () => {
    const clix = await clixApi.getAClix(req.params.id);
    return resp.json(clix);
  }, next);
});

app.put('/clix/:id', async (req, resp, next) => {
  reqHandler(async () => {
    const newClix = await clixApi.updateClix(req.params.id, req.body);
    return resp.json(newClix);
  }, next);
});

app.post('/clix', async (req, resp, next) => {
  reqHandler(async () => {
    const newClix = await clixApi.createClix(req.body);
    return resp.json(newClix);
  }, next);
});

app.delete('/clix/:id', async (req, resp, next) => {
  reqHandler(async () => {
    await clixApi.deleteAClix(req.params.id);
    return resp.send('OK');
  }, next)
});

// game
app.get('/games', async (req, resp) => {
  const games = await gamesApi.getGames();
  return resp.json(games);
});

app.get('/game/:id', async (req, resp, next) => {
  reqHandler(async () => {
    const game = await gamesApi.getGame(req.params.id);
    return resp.json(game);
  }, next);
});

app.post('/game', async (req, resp, next) => {
  reqHandler(async () => {
    const newGame = await gamesApi.createGame(req.body);
    return resp.json(newGame);
  }, next);
});

app.put('/game/:id', async (req, resp, next) => {
  reqHandler(async () => {
    const newGame = await gamesApi.updateGame(
      req.params.id, req.body);
    return resp.json(newGame);
  }, next);
});

app.delete('/game/:id', async (req, resp, next) => {
  reqHandler(async () => {
    await gamesApi.deleteGame(req.params.id);
    return resp.send('OK');
  }, next)
});

app.get('/game/:gameId/clix/:clixId', async (req, resp, next) => {
  reqHandler(async () => {
    const {gameId, clixId} = req.params;
    const clix = await gamesApi.getGameClix(gameId, clixId);
    return resp.json(clix);
  }, next);
});

app.put('/game/:gameId/clix/:clixId', async (req, resp, next) => {
  reqHandler(async () => {
    const {gameId, clixId} = req.params;
    const newClick = await gamesApi.updateGameClix(gameId, clixId, req.body);
    return resp.json(newClick);
  }, next);
});

// stuffs
app.get('/abilities', async (req, resp) => {
  const abilities = await abilityApi.getAbilities();
  return resp.json(abilities);
});

app.get('/enhancements', async (req, resp) => {
  const enhancements = await abilityApi.getEnhancements();
  return resp.json(enhancements);
});

app.get('/keywords', async (req, resp) => {
  const keywords = await abilityApi.getKeywords();
  return resp.json(keywords);
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});


