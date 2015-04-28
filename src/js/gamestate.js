var gameState = function($q, notificationService, $filter, UPGRADES, GainCalculator, localStorage, AnimatedFlyTip) {
  var upgrades = {};
  var units = 0;
  var start = Date.now();
  var lastSave = Date.now();
  var currencyName = 'Unit';
  var ads = true;

  var upgradeDefer = $q.defer();
  var unitDefer = $q.defer();

  var buildSaveObject = function() {
    return {
      units: units,
      upgrades: upgrades,
      start: start,
      lastSave: lastSave,
      currencyName: currencyName,
      ads: ads
    };
  };

  var save = function() {
    lastSave = Date.now();
    localStorage.set('game', buildSaveObject());
  };

  var hardReset = function() {
    start = Date.now();
    units = 0;
    upgrades = {};
    currencyName = 'Unit';
    ads = true;
    save();
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

    if(state.start) {
      start = state.start;
    }

    if(state.currencyName) {
      currencyName = state.currencyName;
    }

    if(!_.isUndefined(state.ads)) {
      ads = state.ads;
    }

    if(state.lastSave) {
      lastSave = state.lastSave;

      if(upgrade.has('Offline Progress')) {
        var diff = Date.now() - state.lastSave;
        var multiplier = 0.25 + (0.25 * upgrade.getKey('Offline Progress'));
        var timersElapsed = Math.floor(diff / GainCalculator.timer(upgrade));
        var gain = timersElapsed * multiplier * GainCalculator.all(upgrade) * GainCalculator.timerBoost(upgrade);
        if(gain > 0) {
          unit.inc(gain, false);
          save();

          if(upgrade.has('Notifications')) {
            var numString = gain;
            if (upgrade.has('Number Formatting')) {
              numString = $filter('number')(numString, 0);
            }

            notificationService.notifyWithDefaults({
              type: 'success',
              title: 'Offline Progression',
              text: `You gained ${numString} ${currencyName}s while offline. Welcome back!`
            });
          }
        }
      }
    }
  };

  var currencySet = {
    set: function(newName) { currencyName = newName; save(); },
    get: function() { return currencyName; }
  };

  var adSet = {
    set: function(isSet) { ads = isSet; },
    get: function() { return ads; }
  };

  var upgrade = {
    has: function(key, level = 0) { return upgrades[key] > level; },
    get: function() { return upgrades; },
    getKey: function(key) { return upgrades[key]; },
    inc: function(key) {

      var nextLevel = upgrades[key] || 0;

      var cost = _.isFunction(UPGRADES[key].levels) ?
        UPGRADES[key].levels(nextLevel).cost :
        UPGRADES[key].levels[nextLevel].cost;
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
    inc: function(amt, display = true) {
      units += amt;
      unitDefer.notify(units);

      if(upgrade.has('Basic Animation') && display) {
        AnimatedFlyTip.fly(amt, upgrade.has('Number Formatting'));
      }

      if(upgrade.has('Save', 1) && !upgrade.has('Save', 3)) {
        if(++tick % 10 === 0) {
          tick = 0;
          save();
        }
      }

      if(upgrade.has('Save', 3)) {
        save();
      }

    },
    get: function() { return units; },
    watch: function() { return unitDefer.promise; }
  };

  load();

  return {
    upgrade: upgrade,
    unit: unit,
    currencySet: currencySet,
    adSet: adSet,
    save: save,
    buildSaveObject: buildSaveObject,
    hardReset: hardReset
  };
};

gameState.$inject = ['$q', 'notificationService', '$filter', 'Upgrades', 'GainCalculator', 'localStorageService', 'AnimatedFlyTip'];

module.exports = gameState;