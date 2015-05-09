
var upgrades = require('./upgrades');
var gameState = require('./gamestate');
var gameTimer = require('./gametimer');
var gainCalculator = require('./gaincalculator');
var functionBuilder = require('./functionbuilder');
var animatedFlyTip = require('./animatedflytip');
var favico = require('./favico');
var gameController = require('./gamecontroller');
var upgradeManager = require('./upgrademanager');
var adManager = require('./admanager');
var chartConfigs = require('./chartconfigs');
var upgradePath = require('./upgradepath');
var sankey = require('./sankey');
var achievements = require('./achievements');

angular.module('c', ['ui.bootstrap', 'hljs', 'LocalStorageModule', 'ngTable', 'angularMoment', 'jlareau.pnotify', 'highcharts-ng'])

  .constant('Upgrades', upgrades)

  .constant('Achievements', achievements)

  .constant('Version', '0.0.1')

  .config(['notificationServiceProvider', function(notificationServiceProvider) {
    notificationServiceProvider.setDefaults({
      addclass: 'stack-bar-bottom',
      width: '70%',
      styling: 'fontawesome'
    });
  }])

  .directive('sankey', sankey)

  .service('favico', favico)

  .service('AnimatedFlyTip', animatedFlyTip)

  .service('GameState', gameState)

  .service('AdManager', adManager)

  .service('ChartConfigs', chartConfigs)

  .service('GameTimer', gameTimer)

  .service('UpgradePath', upgradePath)

  .service('UpgradeManager', upgradeManager)

  .service('GainCalculator', gainCalculator)

  .service('FunctionBuilder', functionBuilder)

  .controller('Game', gameController);