var gameState = function($q, UPGRADES, DumpState) {
  var upgrades = DumpState || {};
  var units = 100000;

  var upgradeDefer = $q.defer();
  var unitDefer = $q.defer();

  return {
    upgrade: {
      has: function(key, level = 0) { return upgrades[key] > level; },
      get: function() { return upgrades; },
      getKey: function(key) { return upgrades[key]; },
      inc: function(key) {

        var nextLevel = upgrades[key] || 0;
        var cost = UPGRADES[key].costs[nextLevel];
        if(units < cost) { return; }
        units -= cost;

        if(!upgrades[key]) { upgrades[key] = 0; }
        upgrades[key]++;
        upgradeDefer.notify({key: key, level: upgrades[key], all: upgrades});
      },
      watch: function() { return upgradeDefer.promise; }
    },
    unit: {
      has: function(amt) { return units > amt; },
      inc: function(amt) {
        units += amt;
        unitDefer.notify(units);
      },
      get: function() { return units; },
      watch: function() { return unitDefer.promise; }
    }
  };
};

gameState.$inject = ['$q', 'Upgrades', 'DumpState'];

module.exports = gameState;