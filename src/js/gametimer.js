var gameTimer = function($q, $interval, $timeout, $window, GameState, AdManager, GainCalculator) {

  var interval = null;
  var timerDefer = $q.defer();

  var startTimer = function(upgradeData = {key: 'Timer'}) {

    if(!GameState.upgrade.has('Basic Timer')) { return; }
    if(!_.contains(upgradeData.key, 'Timer')) { return; }

    if(interval) {
      $interval.cancel(interval);
    }

    interval = $interval(function() {
      $window.increaseUnits(1 + GainCalculator.timerBoost(GameState.upgrade), 'Timer');
      timerDefer.notify(GainCalculator.timer(GameState.upgrade));
    }, GainCalculator.timer(GameState.upgrade));

    timerDefer.notify(GainCalculator.timer(GameState.upgrade));
  };

  if(GameState.upgrade.has('Basic Timer')) {
    $timeout(startTimer, 0);
  }

  GameState.upgrade.watch().then(null, null, startTimer);

  return {
    watch: function() {
      return timerDefer.promise;
    }
  };

};

gameTimer.$inject = ['$q', '$interval', '$timeout', '$window', 'GameState', 'AdManager', 'GainCalculator'];

module.exports = gameTimer;