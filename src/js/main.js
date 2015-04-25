
angular.module('c', [])

  .service('GameState', ['$q', 'Upgrades', function($q, UPGRADES) {
    var upgrades = {};
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
          if(units < cost) return;
          units -= cost;

          if(!upgrades[key]) upgrades[key] = 0;
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
  }])

  .service('GameTimer', [
    '$q', '$interval', '$window', 'GameState', 'GainCalculator',
    function($q, $interval, $window, GameState, GainCalculator) {

      var interval = null;
      var timerDefer = $q.defer();

      var startTimer = function(upgradeData = {key: 'Timer'}) {

        if(!GameState.upgrade.has('Basic Timer')) return;
        if(!_.contains(upgradeData.key, 'Timer')) return;

        if(interval) {
          $interval.cancel(interval);
        }

        interval = $interval(function() {
          $window.increaseUnits();
          timerDefer.notify(GainCalculator.timer());
        }, GainCalculator.timer());

        timerDefer.notify(GainCalculator.timer());
      };

      if(GameState.upgrade.has('Basic Timer')) {
        startTimer();
      }

      GameState.upgrade.watch().then(null, null, startTimer);

      return {
        watch: function() {
          return timerDefer.promise;
        }
      };
  }])

  .constant('Upgrades', {
    Scoreboard: {
      category: 'Visual',
      costs: [10]
    },
    'Basic Layout': {
      category: 'Visual',
      costs: [15, 200]
    },
    'Better Layout': {
      category: 'Visual',
      requirements: {'Basic Layout': 1},
      costs: [200]
    },
    Function: {
      category: 'Tech',
      costs: [20]
    },
    'Basic Iteration': {
      category: 'Tech',
      requirements: {Function: 0},
      costs: [50, 300, 2000, 15000]
    },
    'Basic Timer': {
      category: 'Tech',
      requirements: {Function: 0},
      costs: [50, 600, 20000, 100000]
    },
    'Basic Boost': {
      category: 'Tech',
      requirements: {Function: 0},
      costs: [10, 100, 2500, 10000]
    },
    Grammar: {
      category: 'Visual',
      costs: [100]
    },
    Preformatting: {
      category: 'Visual',
      requirements: {'Basic Iteration': 0},
      costs: [150]
    },
    'Visual Countdown': {
      category: 'Visual',
      requirements: {'Basic Timer': 0},
      costs: [1000]
    },
    'Page Title': {
      category: 'Cosmetic',
      costs: [500]
    },
    'Better Page Title': {
      category: 'Cosmetic',
      requirements: {'Page Title': 0, 'Scoreboard': 0},
      costs: [2500]
    }
  })

  .service('GainCalculator', ['GameState', function(GameState) {

    var boost = function() {
      return Math.pow((GameState.upgrade.getKey('Basic Boost') || 0)+1, 2);
    };

    var iteration = function() {
      var iterLevel = GameState.upgrade.getKey('Basic Iteration');
      if(!iterLevel) return 1;
      return Math.pow(5, iterLevel+1);
    };

    var timer = function() {
      return 30000 - (30000 * 0.25 * GameState.upgrade.getKey('Basic Timer'));
    };

    return {
      boost: boost,
      iteration: iteration,
      timer: timer,
      all: function() { return boost() * iteration(); }
    };
  }])

  .service('FunctionBuilder', [
    'GameState', 'GainCalculator', '$window',
    function(GameState, GainCalculator, $window) {
      return {
        build: function() {

          var functionHeader = ['',''];
          if(GameState.upgrade.has('Function')) {
            functionHeader = [`function increaseUnits() {`, `}`];
          }

          var iterationHeader = ['',''];
          if(GameState.upgrade.has('Basic Iteration')) {
            iterationHeader = [`for(var i = 0; i < ${GainCalculator.iteration()}; i++) {`, `}`];
          }

          var timeout = ``;
          if(GameState.upgrade.has('Basic Timer')) {
            timeout = `$timeout(increaseUnits, ${GainCalculator.timer()});\n`;
          }

          $window.increaseUnits = function() { GameState.unit.inc(GainCalculator.all()); };

          return `
            ${timeout}
            ${functionHeader[0]}
              ${iterationHeader[0]}
                units += ${GainCalculator.boost()};
              ${iterationHeader[1]}
            ${functionHeader[1]}
          `;
        }
      };
  }])

  .controller('Game', [
    '$scope', '$window', '$interval', 'GameState', 'GameTimer', 'FunctionBuilder', 'Upgrades',
    function($scope, $window, $interval, GameState, GameTimer, FunctionBuilder, UPGRADES) {

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
            if(!$scope.hasUpgrade(key, req)) meetsAllReqs = false;
          });

          if(!meetsAllReqs) return;

          _.each(item.costs, (cost, i) => {
            //cost/2 -> more visibility
            if($scope.hasUpgrade(itemName, i) || cost > current) return;

            var prevItem = ret[ret.length-1];

            ret.push({
              name: itemName,
              level: i,
              cost: cost + (prevItem ? prevItem.cost : 0),
              buyLevels: 1 + (prevItem ? prevItem.buyLevels : 0),
              category: item.category
            });
          });

          allRet.push(...ret);

        });

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

      $scope.refresh = function() {
        $scope._units = GameState.unit.get();
        $scope._visibleUpgrades = $scope.visibleUpgrades();
        $scope._function = FunctionBuilder.build();
      };

      $scope.refresh();
      $scope._timer = 0;
      var timerInterval;

      GameState.unit.watch().then(null, null, $scope.refresh);
      GameState.upgrade.watch().then(null, null, $scope.refresh);

      GameTimer.watch().then(null, null, function(newTimerValue) {
        $scope._timer = newTimerValue;
        if(timerInterval) {
          $interval.cancel(timerInterval);
        }
        timerInterval = $interval(function() {
          $scope._timer -= 100;
        }, 100);
      });
    }
  ]);