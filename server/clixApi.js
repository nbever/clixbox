const {Clix, Abilities} = require('./schema');
const mongoose = require('mongoose');
const S = require('../constants');

const isNil = require('lodash/isNil');

const getClix = async function(params) {
  const clix = await Clix.find().populate('enhancements');
  return clix;
};

const getAClix = async function(id) {
  const clix = await Clix.findOne(
    {_id: new mongoose.Types.ObjectId(id)});
  return clix;
};

const deleteAClix = async function(id) {
  await Clix.deleteOne({_id: new mongoose.Types.ObjectId(id)});
  return {status: 'Success'};
};

const updateClix = async function(id, newClixData) {
  const newClix = await Clix.findOneAndReplace(
    {_id: new mongoose.Types.ObjectId(id)},
    newClixData
  );

  const updatedClix = await Clix.findById(id);

  return updatedClix;
}

const isImageInUse = async function(imageName) {
  const clix = await Clix.findOne(
    {image: imageName});

  return {image: imageName, used: !isNil(clix)};
};

const createClix = async function(clix) {
  const oldClix = await Clix.findOne({
    name: clix.name,
    model: clix.model,
    release: clix.release
  });

  if (!isNil(oldClix) && oldClix !== {}) {
    throw new Error('Clix already exists.');
  }

  if (!isNil(clix.enhancements)) {
    const oIds = clix.enhancements.map((en) => {
      return new mongoose.Types.ObjectId(en._id);
    });

    clix.enhancements = oIds;
  }

  clix.keywords = Object.keys(clix.keywords)
    .filter((kw) => {
      return !isNil(clix.keywords[kw]._id);
    })
    .map((realKey) => {
      return {keyword: clix.keywords[realKey]._id, value: null};
    });

  const customId = await Abilities.findOne({action: 'CUSTOM'});

  // replace custom abilities with the new one
  const replacer = (clix, category) => {
    if (!isNil(clix[category].ability)) {
      if (clix[category].ability._id === 'CUST') {
        clix[category].ability = customId;
      }
    }
  };

  clix.clix.forEach((c) => {
    replacer(c, 'move');
    replacer(c, 'attack');
    replacer(c, 'defend');
    replacer(c, 'damage');
  });

  const newClix = await Clix.create(clix);
  return newClix;
};

module.exports = {
  getClix,
  getAClix,
  deleteAClix,
  updateClix,
  createClix,
  isImageInUse
};