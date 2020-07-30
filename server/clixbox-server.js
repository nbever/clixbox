const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const clixApi = require('./clixApi');
const abilityApi = require('./abilityApi');
const gamesApi = require('./gamesApi');

const isNil = require('lodash/isNil');

const {initDB} = require('./init');

const app = express();
app.use('/images', express.static('images'));
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

  console.log('Cleaning images');

  const images = fs.readdirSync(path.join(__dirname, 'images'));
  const unusedImages = 
    (await Promise.all(
      images.map(async (i) => {
        return await clixApi.isImageInUse(i);
      })
    )).filter((result) => {
      return !result.used;
    })
    .forEach((image) => {
      fs.unlink(path.join(__dirname, 'images', image.image), (err) => {
        if (err) {
          throw err;
        }

        console.log(`File removed: ${image.image}`);
      });
    });

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

app.post('/api/images', upload.single('picUpload'), async (req, resp) => {
  const suffix = req.file.originalname.split('.')[1];
  fs.renameSync(req.file.path, `${req.file.path}.${suffix}`);
  resp.json({logo: `${req.file.filename}.${suffix}`});
});

app.delete('/api/images/:imageId', async (req, resp) => {
  fs.unlinkSync('./images/' + req.params.imageId);
});

// clix
app.get('/api/clix', async (req, resp) => {
  const rtn = await clixApi.getClix();
  resp.json(rtn);
});

app.get('/api/clix/:id', async (req, resp, next) => {
  reqHandler(async () => {
    const clix = await clixApi.getAClix(req.params.id);
    return resp.json(clix);
  }, next);
});

app.put('/api/clix/:id', async (req, resp, next) => {
  reqHandler(async () => {
    const newClix = await clixApi.updateClix(req.params.id, req.body);
    return resp.json(newClix);
  }, next);
});

app.post('/api/clix', async (req, resp, next) => {
  reqHandler(async () => {
    const newClix = await clixApi.createClix(req.body);
    return resp.json(newClix);
  }, next);
});

app.delete('/api/clix/:id', async (req, resp, next) => {
  reqHandler(async () => {
    await clixApi.deleteAClix(req.params.id);
    return resp.send('OK');
  }, next)
});

// game
app.get('/api/games', async (req, resp) => {
  const games = await gamesApi.getGames();
  return resp.json(games);
});

app.get('/api/game/:id', async (req, resp, next) => {
  reqHandler(async () => {
    const game = await gamesApi.getGame(req.params.id);
    return resp.json(game);
  }, next);
});

app.post('/api/game', async (req, resp, next) => {
  reqHandler(async () => {
    const newGame = await gamesApi.createGame(req.body);
    return resp.json(newGame);
  }, next);
});

app.put('/api/game/:id', async (req, resp, next) => {
  reqHandler(async () => {
    const newGame = await gamesApi.updateGame(
      req.params.id, req.body);
    return resp.json(newGame);
  }, next);
});

app.delete('/api/game/:id', async (req, resp, next) => {
  reqHandler(async () => {
    await gamesApi.deleteGame(req.params.id);
    return resp.send('OK');
  }, next)
});

app.get('/api/game/:gameId/clix/:clixId', async (req, resp, next) => {
  reqHandler(async () => {
    const {gameId, clixId} = req.params;
    const clix = await gamesApi.getGameClix(gameId, clixId);
    return resp.json(clix);
  }, next);
});

app.put('/api/game/:gameId/clix/:clixId', async (req, resp, next) => {
  reqHandler(async () => {
    const {gameId, clixId} = req.params;
    const newClick = await gamesApi.updateGameClix(gameId, clixId, req.body);
    return resp.json(newClick);
  }, next);
});

// stuffs
app.get('/api/abilities', async (req, resp) => {
  const abilities = await abilityApi.getAbilities();
  return resp.json(abilities);
});

app.get('/api/enhancements', async (req, resp) => {
  const enhancements = await abilityApi.getEnhancements();
  return resp.json(enhancements);
});

app.get('/api/keywords', async (req, resp) => {
  const keywords = await abilityApi.getKeywords();
  return resp.json(keywords);
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});


