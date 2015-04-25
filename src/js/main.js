
var upgrades = require('./upgrades');
var gameState = require('./gamestate');
var gameTimer = require('./gametimer');
var gainCalculator = require('./gaincalculator');
var functionBuilder = require('./functionbuilder');
var animatedFlyTip = require('./animatedflytip');
var favico = require('./favico');

angular.module('c', ['ui.bootstrap', 'hljs'])

  .constant('Upgrades', upgrades)

  .constant('Version', '0.0.1')

  .constant('DumpState', {'Basic Layout': 2,'Scoreboard': 1,'Function': 1,'Basic Timer': 2,'Basic Iteration': 3,'Basic Boost': 3,'Preformatting': 1,'Visual Countdown': 1,'Page Title': 1,'Better Page Title': 1,'Better Layout': 2,'Basic Style': 1,'Number Formatting': 1})

  .service('favico', favico)

  .service('AnimatedFlyTip', animatedFlyTip)

  .service('GameState', gameState)

  .service('GameTimer', gameTimer)

  .service('GainCalculator', gainCalculator)

  .service('FunctionBuilder', functionBuilder)

  .controller('Game', [
    '$scope', '$window', '$interval', 'GameState', 'GameTimer', 'FunctionBuilder', 'Upgrades', 'favico',
    function($scope, $window, $interval, GameState, GameTimer, FunctionBuilder, UPGRADES, favico) {

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

          _.each(item.costs, (cost, i) => {
            var visLevel = GameState.upgrade.getKey('Upgrade Visibility');
            var visibilityBoost = 1 + (_.isUndefined(visLevel) ? 0 : 0.15*visLevel);


            var prevItem = ret[ret.length-1];
            var totalCost = cost + (prevItem ? prevItem.cost : 0);

            if($scope.hasUpgrade(itemName, i) || totalCost/visibilityBoost > current) { return; }

            ret.push({
              name: itemName,
              level: i,
              cost: totalCost,
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

      $scope.refresh = function() {
        $scope._units = GameState.unit.get();
        $scope._visibleUpgrades = $scope.visibleUpgrades();
        $scope._function = FunctionBuilder.build();
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

      $window.dumpState = function() {
        return GameState.upgrade.get();
      };
    }
  ]);