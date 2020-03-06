const {Abilities, Keywords, Enhancements} = require('./schema');
const {abilities, enhancements, keywords} = require('./abilities');

const isNil = require('lodash/isNil');

const getEnhancementIds = async function (enhancement) {
    const tokens = enhancement.split('-');
    const filter = {
      type: tokens[0],
      color: tokens[1]
    };

    if (tokens.length === 3) {
      filter.icon = tokens[2];
    }

    const realEnhancement = await Enhancements.findOne(filter);
    return realEnhancement._id;
};

const initDB = async function() {
  console.log('Installing enhancements...');
  enhancements.forEach(async (en) => {
    await Enhancements.findOneAndUpdate({type: en.type, color: en.color, icon: en.icon},
      en, {upsert: true});
  });


  console.log('Installing keywords...');
  keywords.forEach(async (keyword) => {

    if (!isNil(keyword.enhancements) && keyword.enhancements.length > 0) {
      const enhancmentIds = await Promise.all(keyword.enhancements.map(getEnhancementIds));
      keyword.enhancements = enhancmentIds;
    }

    await Keywords.findOneAndUpdate({term: keyword.term}, keyword, {upsert: true});
  });

  console.log('Installing abilities...');
  abilities.forEach(async (ability) => { 
    if (!isNil(ability.enhancements) && ability.enhancements.length > 0) {
      const enhancmentIds = await Promise.all(ability.enhancements.map(getEnhancementIds));
      ability.enhancements = enhancmentIds;
    }

    await Abilities.findOneAndUpdate({action: ability.action}, ability, {upsert: true});
  });
};

module.exports = {
  initDB
};