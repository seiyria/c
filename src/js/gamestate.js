var gameState = function($q, notificationService, $filter, UPGRADES, GainCalculator, localStorage, AnimatedFlyTip) {

  var getNewState = function() {
    return {
      upgrades: {},
      units: 0,
      start: Date.now(),
      lastSave: Date.now(),
      currencyName: 'Unit',
      ads: true,
      sources: {},
      history: []
    };
  };

  var currentState = getNewState();

  var upgradeDefer = $q.defer();
  var unitDefer = $q.defer();

  var buildSaveObject = function() {
    return currentState;
  };

  var save = function() {
    currentState.lastSave = Date.now();
    localStorage.set('game', buildSaveObject());
  };

  var hardReset = function() {
    currentState = getNewState();
    save();
  };

  var load = function() {
    var state = localStorage.get('game');

    if(!state) { return; }

    _.assign(currentState, state);

    if(!upgrade.has('Offline Progress')) {
      return;
    }

    var diff = Date.now() - state.lastSave;
    var multiplier = 0.25 + (0.25 * upgrade.getKey('Offline Progress'));
    var timersElapsed = Math.floor(diff / GainCalculator.timer(upgrade));
    var gain = timersElapsed * multiplier * GainCalculator.all(upgrade) * GainCalculator.timerBoost(upgrade);

    if(gain <= 0) {
      return;
    }

    unit.inc(gain, false, 'Offline Progress');
    save();

    if(upgrade.has('Notifications')) {
      var numString = gain;
      if (upgrade.has('Number Formatting')) {
        numString = $filter('number')(numString, 0);
      }

      notificationService.notifyWithDefaults({
        type: 'success',
        title: 'Offline Progression',
        text: `You gained ${numString} ${currentState.currencyName}s while offline. Welcome back!`
      });
    }
  };

  var historyGet = {
    get: function() { return currentState.history; }
  };

  var sourcesGet = {
    get: function() { return currentState.sources; }
  };

  var currencySet = {
    set: function(newName) { currentState.currencyName = newName; save(); },
    get: function() { return currentState.currencyName; }
  };

  var adSet = {
    set: function(isSet) { currentState.ads = isSet; },
    get: function() { return currentState.ads; }
  };

  var upgrade = {
    has: function(key, level = 0) { return currentState.upgrades[key] > level; },
    get: function() { return currentState.upgrades; },
    getKey: function(key) { return currentState.upgrades[key]; },
    inc: function(key) {

      var nextLevel = currentState.upgrades[key] || 0;

      var cost = _.isFunction(UPGRADES[key].levels) ?
        UPGRADES[key].levels(nextLevel).cost :
        UPGRADES[key].levels[nextLevel].cost;
      if(currentState.units < cost) { return; }

      if(!currentState.upgrades[key]) { currentState.upgrades[key] = 0; }
      currentState.upgrades[key]++;
      unit.inc(-cost);
      upgradeDefer.notify({key: key, level: currentState.upgrades[key], all: currentState.upgrades});
    },
    watch: function() { return upgradeDefer.promise; }
  };

  var manageHistory = function() {
    var max = GainCalculator.maxHistory(upgrade);

    currentState.history.push({x: Date.now(), y: currentState.units});
    if(currentState.history.length > max) {
      currentState.history.shift();
    }
  };

  var tick = 0;

  var unit = {
    has: function(amt) { return currentState.units > amt; },
    inc: function(amt, display = true, source = 'Click') {
      currentState.units += amt;

      manageHistory();

      if(!currentState.sources[source]) {
        currentState.sources[source] = 0;
      }

      if(amt > 0) {
        currentState.sources[source] += amt;
      }

      unitDefer.notify(currentState.units);

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
    get: function() { return currentState.units; },
    watch: function() { return unitDefer.promise; }
  };

  load();

  return {
    upgrade: upgrade,
    unit: unit,
    currencySet: currencySet,
    adSet: adSet,
    sourcesGet: sourcesGet,
    historyGet: historyGet,
    save: save,
    buildSaveObject: buildSaveObject,
    hardReset: hardReset
  };
};

gameState.$inject = ['$q', 'notificationService', '$filter', 'Upgrades', 'GainCalculator', 'localStorageService', 'AnimatedFlyTip'];

module.exports = gameState;