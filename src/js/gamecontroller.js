var gameController = function($scope, $window, $interval, $filter, $modal, GameState, GameTimer, FunctionBuilder, UPGRADES, favico, NgTableParams) {
  $scope._visibleUpgrades = [];

  $scope.tableParams = new NgTableParams({
    page: 1,
    count: 1000
  }, {
    groupBy: 'category',
    total: $scope._visibleUpgrades.length,
    getData: function($defer, params) {
      var data = $scope._visibleUpgrades;

      var orderedData = params.sorting() ?
        $filter('orderBy')(data, params.orderBy()) :
        data;

      var filteredData = params.filter() ?
        $filter('filter')(orderedData, params.filter()) :
        orderedData;

      params.total($scope._visibleUpgrades.length);

      $defer.resolve(filteredData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
    }
  });

  $scope.hasUpgrade = function(key, level = 0) {
    return GameState.upgrade.has(key, level);
  };

  $scope.hasUnits = function(amt) {
    return GameState.unit.has(amt);
  };

  $scope.visibleUpgrades = function() {

    var current = $scope._units;
    var allRet = [];

    _.each(UPGRADES, (item, itemName) => {

      var ret = [];

      var meetsAllReqs = true;

      _.each(item.requirements, (req, key) => {
        if(!$scope.hasUpgrade(key, req)) { meetsAllReqs = false; }
      });

      if(!meetsAllReqs) { return; }

      _.each(item.levels, (level, i) => {
        var visLevel = GameState.upgrade.getKey('Upgrade Visibility');
        var visibilityBoost = 1 + (_.isUndefined(visLevel) ? 0 : 0.15*visLevel);
        var prevItem = ret[ret.length-1];
        var totalCost = level.cost + (prevItem ? prevItem.cost : 0);

        if($scope.hasUpgrade(itemName, i) || totalCost/visibilityBoost > current) { return; }

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

    if($scope.hasUpgrade('Alphabetized Upgrades')) {
      allRet = _.sortByOrder(allRet, ['name', 'level'], [true, true]);
    }

    if($scope.hasUpgrade('Best Favicon')) {
      var buyableUpgrades = _.filter(allRet, item => item.cost < $scope._units).length;
      if(buyableUpgrades > 0) {
        favico.badge(buyableUpgrades);
      } else {
        favico.reset();
      }
    }

    return allRet;
  };

  $scope.buyUpgrade = function(upgName, levels = 1) {
    do {
      GameState.upgrade.inc(upgName);
    } while(--levels > 0);
  };

  $scope.gainUnits = function() {
    $window.increaseUnits();
  };

  $scope.save = function() {
    GameState.save();
  };

  $scope.refresh = function() {
    $scope._units = GameState.unit.get();
    $scope._visibleUpgrades = $scope.visibleUpgrades();
    $scope._function = FunctionBuilder.build();
    $scope.tableParams.reload();
  };

  $scope.openModal = function(modal) {
    $modal.open({
      templateUrl: `modal-${modal}`,
      scope: $scope
    });
  };

  $scope.refresh();
  $scope._timer = 0;
  $scope._timermax = 0;
  var timerInterval;

  GameState.unit.watch().then(null, null, $scope.refresh);
  GameState.upgrade.watch().then(null, null, $scope.refresh);

  GameTimer.watch().then(null, null, function(newTimerValue) {
    $scope._timer = $scope._timerMax = newTimerValue;
    if(timerInterval) {
      $interval.cancel(timerInterval);
    }
    timerInterval = $interval(function() {
      $scope._timer -= 100;
    }, 100);
  });

  $scope.saveObject = function() {
    return GameState.buildSaveObject();
  };

  $scope.debugInfo = $window.dumpDebugInfo = function() {
    return JSON.stringify($scope.saveObject(), null, 4);
  };

};

gameController.$inject = ['$scope', '$window', '$interval', '$filter', '$modal', 'GameState', 'GameTimer', 'FunctionBuilder', 'Upgrades', 'favico', 'ngTableParams'];

module.exports = gameController;