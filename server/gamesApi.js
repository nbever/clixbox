const {Games} = require('./schema');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

const isNil = require('lodash/isNil');

module.exports.getGames = async function() {
  const games = await Games.find();
  return games;
};

module.exports.getGame = async function(id) {
  const game = await Games.findById(id);
  return game;
};

module.exports.createGame = async function(game) {
  const newGame = await Games.create(game);
  return newGame;
};

module.exports.updateGame = async function(id, game) {
  await Games.findOneAndReplace(
    {_id: new ObjectId(id)}, game);

  const updatedGame = await Games.findById(id);
  return updatedGame;
};

module.exports.deleteGame = async function(id) {
  await Games.deleteOne({_id: new ObjectId(id)});
};

module.exports.getGameClix = async function(gameId, clixId) {
  const game = await Games.findById(gameId).populate({
    path: 'teams.roster.clix',
    model: 'Clix'
  });

  const clix = game.teams.reduce((val, team) => {

    if (!isNil(val)) {
      return val;
    }

    const clix = team.roster.find((clic) => {
      const str = clic.clix._id.toString();
      return str === clixId;
    });

    return clix;
  }, null);

  return clix;
};

module.exports.updateGameClix = async function(gameId, clixId, clix) {

  const game = await Games.findById(gameId);
  game.teams.forEach((team) => {
    const cIndex = team.roster.findIndex((c) => {
      return c.clix.toString() === clixId;
    });

    const oId = team.roster[cIndex].clix;
    team.roster[cIndex].remove();
    team.roster.push({
      ...clix,
      clix: oId
    });
  });

  await Games.findByIdAndUpdate(gameId, game);
  const newClix = await module.exports.getGameClix(gameId, clixId);
  return newClix;
};