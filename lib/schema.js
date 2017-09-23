'use strict';

const Joi = require('joi');
const internals = {};

internals.option = exports.option = Joi.object().keys({
  name: Joi.string().token().required(),
  models: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
  sequelize: Joi.object().required(), // .type(Sequelize) was causing problems in testing bs of this: https://github.com/hapijs/joi/issues/1200
  sync: Joi.boolean().default(false),
  forceSync: Joi.boolean().default(false),
  debug: Joi.boolean(),
  injectServer: Joi.alternatives().try(Joi.object(), Joi.boolean()).default(false),
  injectLoggingFunction: Joi.alternatives().try(Joi.func(), Joi.boolean()),
  onConnect: Joi.func().arity(1)
});

exports.options = Joi.alternatives().try(Joi.array().items(internals.option), internals.option);
