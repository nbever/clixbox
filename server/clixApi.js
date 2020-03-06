const {Clix} = require('./schema');

const isNil = require('lodash/isNil');

const getClix = async function(params) {
  const clix = await Clix.find();
  return clix;
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

  const newClix = await Clix.create(clix);
  return newClix;
};

module.exports = {
  getClix,
  createClix
};