var gainCalculator = function(GameState) {

  var boost = function() {
    return Math.pow((GameState.upgrade.getKey('Basic Boost') || 0)+1, 2);
  };

  var iteration = function() {
    var iterLevel = GameState.upgrade.getKey('Basic Iteration');
    if(!iterLevel) { return 1; }
    return Math.pow(4, iterLevel+1);
  };

  var timer = function() {
    return 30000 - (30000 * 0.1 * GameState.upgrade.getKey('Basic Timer'));
  };

  return {
    boost: boost,
    iteration: iteration,
    timer: timer,
    all: function() { return boost() * iteration(); }
  };
};

gainCalculator.$inject = ['GameState'];

module.exports = gainCalculator;