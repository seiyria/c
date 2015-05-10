var gameController = function($scope, $window, $interval, $filter, $http, $modal, GameState, ChartConfigs, GameTimer, UpgradeManager, FunctionBuilder, UpgradePath, NgTableParams, ACHIEVEMENTS) {
  $scope.ACHIEVEMENTS = ACHIEVEMENTS;
  $scope._visibleUpgrades = [];
  $scope.groupVisibleHash = {};
  $scope.tabActive = [true, false, false, false];

  $http.get('version.json').then(res => $scope.versionInfo = res.data);

  $scope.ads = GameState.adSet.get();
  $scope.setAds = function(val) {
    $scope.ads = val;
    GameState.adSet.set(val);
    if(!val) {
      GameState.achieve('Think Of The Children');
    }
    $scope.save();
  };

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

  $scope.buyUpgrade = function(upgName, levels = 1) {
    do {
      GameState.upgrade.inc(upgName);
    } while(--levels > 0);
    if(upgName === 'Achievements') {
      GameState.achieve('Upgrade Complete');
    }
  };

  $scope.gainUnits = function() {
    $window.increaseUnits(1, 'Click');
  };

  $scope.save = function() {
    GameState.save();
  };

  $scope.refresh = function() {
    $scope._units = GameState.unit.get();

    var newUpgrades = UpgradeManager.visible();
    var visible = _.pluck($scope._visibleUpgrades, 'name');
    var newPlucked = _.pluck(newUpgrades, 'name');
    if(newPlucked.length !== visible.length || _.difference(newPlucked, visible).length > 0) {
      $scope._visibleUpgrades = newUpgrades;
    }
    $scope._function = FunctionBuilder.build();
    $scope.tableParams.reload();

    $scope.upgrades = UpgradeManager.upgrades();
    $scope.maxUpgrades = UpgradeManager.maxUpgrades();
    if($scope.upgrades.length >= $scope.maxUpgrades) {
      GameState.achieve('Upgradus Maximus');
    }
    $scope.achievements = GameState.achievementGet.get();
    $scope.spentOnUpgrades = _.reduce($scope.upgrades, (prev, cur) => prev + cur.cost, 0);
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

  $scope.chartData = ChartConfigs.get();

  ChartConfigs.watch().then(null, null, function(chartData) {
    _.each(_.keys(chartData), key => {
      $scope.chartData[key].series[0].data = chartData[key];
    });
  });

  $scope.saveObject = function() {
    return GameState.buildSaveObject();
  };

  $scope.debugInfo = $window.dumpDebugInfo = function() {
    return JSON.stringify($scope.saveObject(), null, 4);
  };

  $scope.resetGame = function(callback = function(){}) {

    var finalCallback = function() {
      GameState.hardReset();
      $scope.refresh();
      $scope.currencyName = GameState.currencySet.get();
      callback();
    };

    if($scope.hasUpgrade('Confirmation Dialogs')) {
      bootbox.confirm('Are you sure you want to hard reset? Nothing will be saved.', function(result) {
        if(!result) { return; }
        finalCallback();
      });
    } else {
      finalCallback();
    }
  };

  $scope.currencyName = GameState.currencySet.get();
  $scope.changeCurrency = function() {
    bootbox.prompt({title: 'What would you like to call the currency?', value: $scope.currencyName, callback: function(result) {
      if(!result || !result.trim()) { return; }
      GameState.currencySet.set(result);
      $scope.currencyName = GameState.currencySet.get();
      GameState.achieve('Personalized Touch');
      $scope.$digest();
      $scope.refresh();
    }});
  };

};

gameController.$inject = ['$scope', '$window', '$interval', '$filter', '$http', '$modal', 'GameState', 'ChartConfigs', 'GameTimer', 'UpgradeManager', 'FunctionBuilder', 'UpgradePath', 'ngTableParams', 'Achievements'];

module.exports = gameController;
