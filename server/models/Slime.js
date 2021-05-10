const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let SlimeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const SlimeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  level: {
    type: Number,
    min: 1,
    required: true,
  },

  health: {
    type: Number,
    min: 1,
    required: true,
  },

  max_health: {
    type: Number,
    min: 1,
    required: true,
  },

  attack: {
    type: Number,
    min: 1,
    required: true,
  },

  exp:{
    type: Number,
    min: 0,
    required: true,
  },

  perk: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

SlimeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  level: doc.level,
  perk: doc.perk,
  health: doc.health,
  max_health: doc.max_health,
  attack: doc.attack,
  exp: doc.exp
});

SlimeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return SlimeModel.find(search).select('name level health max_health attack exp perk').lean().exec(callback);
};

SlimeSchema.statics.findByName = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name,
  };

  return SlimeModel.findOne(search, callback);
};

SlimeSchema.statics.findById = (id, callback) => {
  const search = {
    _id: convertId(id)
  };

  return SlimeModel.findOne(search, callback);
};

SlimeModel = mongoose.model('Slime', SlimeSchema);

module.exports.SlimeModel = SlimeModel;
module.exports.SlimeSchema = SlimeSchema;
