var gameState = function($q, UPGRADES, localStorage, AnimatedFlyTip, DumpState) {
  var upgrades = DumpState || {};
  var units = 100000;

  var upgradeDefer = $q.defer();
  var unitDefer = $q.defer();

  var buildSaveObject = function() {
    return {
      units: units,
      upgrades: upgrades
    };
  };

  var save = function() {
    localStorage.set('game', buildSaveObject());
  };

  var load = function() {
    var state = localStorage.get('game');

    if(!state) { return; }

    if(state.units) {
      units = state.units;
    }

    if(state.upgrades) {
      upgrades = state.upgrades;
    }
  };

  var upgrade = {
    has: function(key, level = 0) { return upgrades[key] > level; },
    get: function() { return upgrades; },
    getKey: function(key) { return upgrades[key]; },
    inc: function(key) {

      var nextLevel = upgrades[key] || 0;
      var cost = UPGRADES[key].costs[nextLevel];
      if(units < cost) { return; }

      if(!upgrades[key]) { upgrades[key] = 0; }
      upgrades[key]++;
      unit.inc(-cost);
      upgradeDefer.notify({key: key, level: upgrades[key], all: upgrades});
    },
    watch: function() { return upgradeDefer.promise; }
  };

  var tick = 0;

  var unit = {
    has: function(amt) { return units > amt; },
    inc: function(amt) {
      units += amt;
      unitDefer.notify(units);

      if(upgrade.has('Basic Animation')) {
        AnimatedFlyTip.fly(amt, upgrade.has('Number Formatting'));
      }

      if(upgrade.has('Save', 1)) {
        if(tick++ % 10 === 0) {
          tick = 0;
          save();
        }
      }

    },
    get: function() { return units; },
    watch: function() { return unitDefer.promise; }
  };

  load();

  return {
    upgrade: upgrade,
    unit: unit,
    save: save,
    buildSaveObject: buildSaveObject
  };
};

gameState.$inject = ['$q', 'Upgrades', 'localStorageService', 'AnimatedFlyTip', 'DumpState'];

module.exports = gameState;