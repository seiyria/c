
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

angular.module('c', ['ui.bootstrap', 'hljs', 'LocalStorageModule', 'ngTable', 'angularMoment', 'jlareau.pnotify'])

  .constant('Upgrades', upgrades)

  .constant('Version', '0.0.1')

  .config(['notificationServiceProvider', function(notificationServiceProvider) {
    notificationServiceProvider.setDefaults({
      addclass: 'stack-bar-bottom',
      width: '70%',
      styling: 'fontawesome'
    });
  }])

  .service('favico', favico)

  .service('AnimatedFlyTip', animatedFlyTip)

  .service('GameState', gameState)

  .service('AdManager', adManager)

  .service('GameTimer', gameTimer)

  .service('UpgradeManager', upgradeManager)

  .service('GainCalculator', gainCalculator)

  .service('FunctionBuilder', functionBuilder)

  .controller('Game', gameController);