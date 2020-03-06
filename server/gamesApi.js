const {Games} = require('./schema');
const mongoose = require('mongoose');
const {ObjectId} = mongoose.Types;

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
  const clix = Games.find({});
};