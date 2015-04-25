var gameState = function($q, UPGRADES, AnimatedFlyTip, DumpState) {
  var upgrades = DumpState || {};
  var units = 100000;

  var upgradeDefer = $q.defer();
  var unitDefer = $q.defer();

  var upgrade = {
    has: function(key, level = 0) { return upgrades[key] > level; },
    get: function() { return upgrades; },
    getKey: function(key) { return upgrades[key]; },
    inc: function(key) {

      var nextLevel = upgrades[key] || 0;
      var cost = UPGRADES[key].costs[nextLevel];
      if(units < cost) { return; }
      unit.inc(-cost);

      if(!upgrades[key]) { upgrades[key] = 0; }
      upgrades[key]++;
      upgradeDefer.notify({key: key, level: upgrades[key], all: upgrades});
    },
    watch: function() { return upgradeDefer.promise; }
  };

  var unit = {
    has: function(amt) { return units > amt; },
    inc: function(amt) {
      units += amt;
      unitDefer.notify(units);

      if(upgrade.has('Basic Animation')) {
        AnimatedFlyTip.fly(amt, upgrade.has('Number Formatting'));
      }
    },
    get: function() { return units; },
    watch: function() { return unitDefer.promise; }
  };

  return {
    upgrade: upgrade,
    unit: unit
  };
};

gameState.$inject = ['$q', 'Upgrades', 'AnimatedFlyTip', 'DumpState'];

module.exports = gameState;