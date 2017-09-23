## happier-sequelize - a Hapi plugin for the Sequelize ORM based on hapi-sequelize

[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/happier-sequelize)

### This is simply an updated version of danecando/hapi-sequelize: https://github.com/danecando/hapi-sequelize

### Changelog

* Updated sequelize peer-dependency to ^4.0
* Added destroyAllData() method to DB to clear all data from model tables

## 0.1.8ish

* Added opts.server field to options to allow a way to pass the hapi server object to models (mostly for logging), can be true to automatically insert server instance or the actual server instance itself
* DB.getAllModelsAsArray() returns models as array
* Tests working with postgres
* Dropped pg dependency to 6.4.2 to avoid this: https://github.com/feathersjs/generator-feathers/issues/246

