var gameTimer = function($q, $interval, $timeout, $window, GameState, GainCalculator) {

  var interval = null;
  var timerDefer = $q.defer();

  var startTimer = function(upgradeData = {key: 'Timer'}) {

    if(!GameState.upgrade.has('Basic Timer')) { return; }
    if(!_.contains(upgradeData.key, 'Timer')) { return; }

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
    $timeout(startTimer, 0);
  }

  GameState.upgrade.watch().then(null, null, startTimer);

  return {
    watch: function() {
      return timerDefer.promise;
    }
  };

};

gameTimer.$inject = ['$q', '$interval', '$timeout', '$window', 'GameState', 'GainCalculator'];

module.exports = gameTimer;