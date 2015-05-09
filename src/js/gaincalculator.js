var gainCalculator = function() {

  var boost = (upgrade) => Math.max(1, Math.pow(upgrade.getKey('Basic Boost') || 0, 2)+1);

  var iteration = function(upgrade) {
    var iterLevel = upgrade.getKey('Basic Iteration');
    if(!iterLevel) { return 1; }
    return Math.pow(2, iterLevel+1);
  };

  var timerBoost = (upgrade) => Math.max(1, Math.pow(upgrade.getKey('Basic Timer Boost') || 0, 2)+1);

  var timer = function(upgrade) {
    var basicReduction = 0.05 * upgrade.getKey('Basic Timer');
    var advancedReduction = 0.15 * upgrade.getKey('Advanced Timer');
    advancedReduction = _.isNaN(advancedReduction) ? 0 : advancedReduction;
    return 30000 - Math.round(30000 * (basicReduction + advancedReduction));
  };

  var maxHistory = function(upgrade) {
    return 10 + (5 * (upgrade.getKey('Production History') || 0));
  };

  return {
    boost: boost,
    iteration: iteration,
    timer: timer,
    timerBoost: timerBoost,
    maxHistory: maxHistory,
    all: function(upgrade) { return boost(upgrade) * iteration(upgrade); }
  };
};

module.exports = gainCalculator;