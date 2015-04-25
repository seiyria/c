var functionBuilder = function(GameState, GainCalculator, $window) {
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
        timeout = `$interval(increaseUnits, ${GainCalculator.timer()});\n`;
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
};

functionBuilder.$inject = ['GameState', 'GainCalculator', '$window'];

module.exports = functionBuilder;