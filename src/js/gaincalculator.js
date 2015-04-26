var gainCalculator = function(GameState) {

  var boost = function() {
    return Math.pow((GameState.upgrade.getKey('Basic Boost') || 0)+1, 2);
  };

  var iteration = function() {
    var iterLevel = GameState.upgrade.getKey('Basic Iteration');
    if(!iterLevel) { return 1; }
    return Math.pow(2, iterLevel+1);
  };

  var timer = function() {
    var basicReduction = 0.05 * GameState.upgrade.getKey('Basic Timer');
    var advancedReduction = 0.15 * GameState.upgrade.getKey('Advanced Timer');
    advancedReduction = _.isNaN(advancedReduction) ? 0 : advancedReduction;
    return 30000 - Math.round(30000 * (basicReduction + advancedReduction));
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