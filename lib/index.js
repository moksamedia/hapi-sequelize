/**
 * happier-sequelize
 *
 * A Hapi plugin for the Sequelize ORM
 *
 * ## config
 *  [{
 *    name: 'dbname',
 *    models: ['path/one/*.js', 'path/two/*.js'],
 *    sequelize: new Sequelize(options),
 *    sync: true,
 *    forceSync: false,
 *    onConnect: function (database) { ... },
 *    debug: true
 *  }]
 *
 * @exports register
 */

'use strict';

const _ = require('lodash');

const Joi = require('joi');
const Schema = require('./schema');
const Models = require('./models');
const DB = require('./DB');
const Pkg = require('../package.json');

// Module globals
const internals = {};

internals.configure = function (opts) {
  return opts.sequelize.authenticate()
    .then(() => {

      // get the file paths
      const files = Models.getFiles(opts.models);

      if (!files || !files.length) {
        throw new Error('No model files were found at path ' + opts.models);
      }

      // load the models
      let models = Models.load(files, opts.sequelize.import.bind(opts.sequelize));

      // apply model relations
      models = Models.applyRelations(models);

      // inject the server reference into the models
      if (_.has(opts, 'server')) {
        _.forOwn(models, function(value, key) {
          value.server = opts.server;
        });
      }

      return models;
    })
    .then((models) => {
      if (opts.sync) {
        return opts.sequelize.sync({ force: opts.forceSync })
          .then(() => new DB(opts.sequelize, models));
      }
      return new DB(opts.sequelize, models);
    })
    .then((database) => {
      if (opts.onConnect) {
        let maybePromise = opts.onConnect(opts.sequelize);
        if (maybePromise && typeof maybePromise.then === 'function')
          return maybePromise.then(() => database);
      }
      return database;
    });
};

exports.register = function(server, options, next) {

  if (!options) throw new Error('Missing happier-sequelize plugin options');

  if (!Array.isArray(options)) options = [options];

  const validation = Joi.validate(options, Schema.options);

  if (!validation || validation.error) throw validation.error;

  const getDb = (request) => {
    return function getDb(name) {
      if (!name || !request.server.plugins[Pkg.name].hasOwnProperty(name)) {
        const key = Object.keys(request.server.plugins[Pkg.name]).shift();
        return request.server.plugins[Pkg.name][key];
      }
      return request.server.plugins[Pkg.name][name];
    };
  };

  server.decorate('request', 'getDb', getDb, { apply: true });

  const configured = options.reduce((acc, opts) => {
    return [].concat(acc, [
      internals.configure(opts)
        .then((db) => {
          server.expose(opts.name, db);
          return Promise.resolve(db);
        })
    ]);
  }, []);

  Promise.all(configured)
    .then(() => {
      return next()
    })
    .catch((err) => {
      return next(err)
    });
};


exports.register.attributes = {
  pkg: Pkg
};
