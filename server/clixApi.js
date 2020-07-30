const {Clix} = require('./schema');
const mongoose = require('mongoose');

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
  await Clix.deleteOne(new mongoose.Types.ObjectId(id));
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
      return new mongoose.Types.ObjectId(en);
    });

    clix.enhancements = oIds;
  }

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