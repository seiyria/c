var upgradeManager = function(GameState, UPGRADES, favico) {

  var hasUpgrade = function(key, level = 0) {
    return GameState.upgrade.has(key, level);
  };

  var visible = function() {

    var current = GameState.unit.get();
    var allRet = [];

    _.each(UPGRADES, (item, itemName) => {

      var ret = [];

      var meetsAllReqs = true;

      _.each(item.requirements, (req, key) => {
        if(!hasUpgrade(key, req)) { meetsAllReqs = false; }
      });

      if(!meetsAllReqs) { return; }

      var levels = item.levels;
      if(_.isFunction(item.levels)) {
        var nextLevel = GameState.upgrade.getKey(itemName) || 0;
        levels = {};
        levels[nextLevel] = item.levels(nextLevel);
      }

      _.each(levels, (level, i) => {
        var visLevel = GameState.upgrade.getKey('Upgrade Visibility');
        var visibilityBoost = 1 + (_.isUndefined(visLevel) ? 0 : 0.15*visLevel);
        var prevItem = ret[ret.length-1];
        var totalCost = level.cost + (prevItem ? prevItem.cost : 0);

        if(hasUpgrade(itemName, i) || totalCost/visibilityBoost > current) { return; }

        ret.push({
          name: itemName,
          level: i,
          cost: totalCost,
          description: level.description,
          buyLevels: 1 + (prevItem ? prevItem.buyLevels : 0),
          category: item.category
        });
      });

      allRet.push(...ret);

    });

    if(hasUpgrade('Alphabetized Upgrades')) {
      allRet = _.sortByOrder(allRet, ['name', 'level'], [true, true]);
    }

    if(hasUpgrade('Best Favicon')) {
      var buyableUpgrades = _.filter(allRet, item => item.cost < current).length;
      if(buyableUpgrades > 0) {
        favico.badge(buyableUpgrades);
      } else {
        favico.reset();
      }
    }

    return allRet;
  };

  var upgrades = () => {
    var ret = [];
    _.each(GameState.upgrade.get(), (val, key) => {
      for(var i = 0; i < val; i++) {
        ret.push({name: key, level: i, cost: UPGRADES[key] ? UPGRADES[key].levels[i].cost : 0});
      }
    });

    if(hasUpgrade('Alphabetized Upgrades')) {
      ret = _.sortByOrder(ret, ['name', 'level'], [true, true]);
    }

    return ret;
  };

  var maxUpgrades = () => _.reduce(UPGRADES, (prev, obj) => prev + obj.levels.length, 0);

  return {
    visible: _.throttle(visible, 50),
    upgrades: _.throttle(upgrades, 50),
    maxUpgrades: _.throttle(maxUpgrades, 50)
  };
};

upgradeManager.$inject = ['GameState', 'Upgrades', 'favico'];

module.exports = upgradeManager;