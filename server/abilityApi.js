const {Abilities, Keywords, Enhancements} = require('./schema');

const getAbilities = async function() {
  const list = Abilities.find();
  return list;
};

const getEnhancements = async function() {
  const list = Enhancements.find();
  return list;
};

const getKeywords = async function() {
  const list = Keywords.find();
  return list;
};

const addAbility = async function(ability) {
  const duplicateAbility = await Abilities.findOne(ability);

  if (duplicateAbility) {
    return duplicateAbility;
  }

  const newAbility = await Abilities.create(ability);
  return newAbility;
};

const addKeyword = async function(keyword) {
};

module.exports = {
  getAbilities,
  addAbility,
  getEnhancements,
  getKeywords
};