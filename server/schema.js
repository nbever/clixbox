const mongoose = require('mongoose');

const extraAbilitySchema = new mongoose.Schema({
  category: String,
  action: String
});

const keywordPairSchema = new mongoose.Schema({
  keyword: String,
  value: mongoose.Mixed
});

const abilitySchema = new mongoose.Schema({
  action: String,
  color: String,
  text: String,
  category: String,
  enhancements: [mongoose.ObjectId],
  keywords: [keywordPairSchema],
  abilities: [extraAbilitySchema]
});

const enhancementSchema = new mongoose.Schema({
  type: String,
  color: String,
  text: String,
  icon: String
});

const valueSchema = new mongoose.Schema({
  value: Number,
  ability: mongoose.ObjectId
});

const clickSchema = new mongoose.Schema({
  move: valueSchema,
  attack: valueSchema,
  defend: valueSchema,
  damage: valueSchema,
  ordinal: Number
});

const keywordSchema = new mongoose.Schema({
  term: String,
  abilities: [extraAbilitySchema],
  keywords: [keywordPairSchema],
  enhancements: [{type: mongoose.ObjectId, ref: 'Enhancements'}],
  text: String
});

const clixSchema = new mongoose.Schema({
  name: String,
  model: String,
  release: String,
  rangeTargets: Number,
  range: Number,
  cost: String,
  clix: [clickSchema],
  customAbilities: [abilitySchema],
  enhancements: [{type: mongoose.ObjectId, ref: 'Enhancements'}],
  keywords: [keywordPairSchema]
});

const clixStatusSchema = new mongoose.Schema({
  clix: {type: mongoose.ObjectId, ref: 'Clix'},
  onClick: Number,
  actionTokens: Number,
  knockedOut: Boolean,
  notes: String
});

const teamSchema = new mongoose.Schema({
  name: String,
  player: String,
  roster: [clixStatusSchema]
});

const gameSchema = new mongoose.Schema({
  name: String,
  teams: [teamSchema]
});

const Games = mongoose.model('Games', gameSchema);
const Clix = mongoose.model('Clix', clixSchema);
const Keywords = mongoose.model('Keywords', keywordSchema);
const Abilities = mongoose.model('Abilities', abilitySchema);
const Enhancements = mongoose.model('Enhancements', enhancementSchema);

module.exports = {
  Clix,
  Games,
  Keywords,
  Abilities,
  Enhancements
};