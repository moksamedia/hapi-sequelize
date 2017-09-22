## happier-sequelize - a Hapi plugin for the Sequelize ORM based on hapi-sequelize

[![npm](https://img.shields.io/npm/dm/localeval.svg)](https://www.npmjs.com/package/happier-sequelize)

### This is simply an updated version of danecando/hapi-sequelize: https://github.com/danecando/hapi-sequelize

### Changelog

* Updated sequelize peer-dependency to ^4.0
* Added destroyAllData() method to DB to clear all data from model tables
* Added opts.server field to options to allow a way to pass the hapi server object to models (mostly for logging)
