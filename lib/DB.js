'use strict';

const _ = require('lodash');

function DB(sequelize, models) {
  this.sequelize = sequelize;
  this.models = models;
}

DB.prototype.getModel = function getModel(name) {
  return this.models.hasOwnProperty(name) ? this.models[name] : null;
};

DB.prototype.getModelsAsArray = function getModels() {
  return _.values(this.models);
};

DB.prototype.getModels = function getModels() {
  return this.models;
};

DB.prototype.destroyAllData = function destroyAll(truncate) {

  let funcs = [];

  _.forOwn(this.models, function(value) {
    let destroyFunc = new Promise( (resolve, reject) => {
      value.destroy({
        where: {},
        truncate: truncate
      }).then( (numDeleted) => {
        console.log(numDeleted + " entries deleted from " + value.name);
        resolve(numDeleted);
      }).catch( function(err) {
        reject(err);
      });
    });

    funcs.push(destroyFunc);

  });

  return Promise.all(funcs);

};

/*

function asyncHelper(modelsToDestroy) {

  return new Promise( (resolve, reject) => {

    let toDestroy = modelsToDestroy[0];

    if (_.has(toDestroy, 'associations') && _.keys(toDestroy.associations).length > 0) {

      let associations = _.reduce(_.values(toDestroy.associations), function (acc, val) {
        acc.push(val.target);
        return acc;
      }, []);

      let undestroyedAssociations = _.intersection(associations, modelsToDestroy);

      // find the models to destroy without the undestroyed associations
      let newModelsToDestroy = _.difference(modelsToDestroy, undestroyedAssociations);

      // concat the undestroyed associate models to the front of the line
      newModelsToDestroy = _.concat(undestroyedAssociations, newModelsToDestroy);

      modelsToDestroy = newModelsToDestroy;

      toDestroy = modelsToDestroy[0];
    }

    console.log("Destroying model " + toDestroy.name);

    toDestroy.destroy({
      where: {},
      truncate: true
    }).then( (numDeleted) => {
      resolve(_.drop(modelsToDestroy, 1));
    }).catch( (err) => {
      reject(err);
    });

  });

}

DB.prototype.destroyAllDataWalk = function destroyAllWalk(modelsToDestroy) {

  modelsToDestroy = (typeof modelsToDestroy !== 'undefined') ? modelsToDestroy : _.values(this.models);

  function shouldRecur(modelsToDestroy) {

    if (modelsToDestroy.length != 0) {
      return destroyAllWalk(modelsToDestroy);
    }
    else {
      return "Done";
    }

  };

  return asyncHelper(modelsToDestroy).then(shouldRecur);

};
*/

module.exports = DB;
