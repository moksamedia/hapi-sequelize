'use strict';

// Load modules
const Lab = require('lab');
const Code = require('code');
const Sinon = require('sinon');
const Hapi = require('hapi');
const Sequelize = require('sequelize');

// Module globals
const internals = {};

// Test shortcuts
const lab = exports.lab = Lab.script();
const test = lab.test;
const expect = Code.expect;

const databaseHost = 'localhost';
const databasePort = 5432;
const databaseDialect = 'postgres';
const databaseUsername = 'postgres';
const databasePassword = 'postgres';

function getSequelize() {
  return new Sequelize(databaseUsername, databasePassword, '', {
    host: databaseHost,
    port: databasePort,
    dialect: databaseDialect
  });
}

lab.suite('happier-sequelize', () => {

  test('plugin works', { parallel: true }, (done) => {

    const server = new Hapi.Server();
    server.connection();

    const onConnect = function (database) {
      server.log('onConnect called');
    };

    const spy = Sinon.spy(onConnect);

    server.register([
      {
        register: require('../lib'),
        options: [
          {
            name: 'test',
            models: ['./test/models/**/*.js'],
            sequelize: getSequelize(),
            sync: true,
            forceSync: true,
            onConnect: spy,
            server:true
          }
        ]
      }
    ], (err) => {

      expect(err).to.not.exist();

      expect(server.plugins['happier-sequelize']['test'].sequelize).to.be.an.instanceOf(Sequelize);

      let models = server.plugins['happier-sequelize']['test'].getModelsAsArray();

      expect(models.length).to.equal(6);

      expect(typeof models[0].server).to.equal(typeof server);

      expect(spy.getCall(0).args[0]).to.be.an.instanceOf(Sequelize);

      done();

    })
  });

  test('plugin throws error when no models are found', { parallel: true }, (done) => {

    const server = new Hapi.Server();
    server.connection();

    server.register([
      {
        register: require('../lib'),
        options: [
          {
            name: 'foo',
            models: ['./foo/**/*.js'],
            sequelize: getSequelize(),
            sync: true,
            forceSync: true
          }
        ]
      }
    ], (err) => {
      expect(err).to.exist();
      done();
    })
  });
});
