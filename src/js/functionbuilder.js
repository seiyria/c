var functionBuilder = function(GameState, GainCalculator, $window) {
  return {
    build: function() {

      var unitText = 'units';

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

      var animationHeader = ['',''];
      if(GameState.upgrade.has('Basic Animation')) {
        animationHeader = [
          `var totalUnitsGained = 0;`,
          `units += totalUnitsGained;
          animateUnitChange(totalUnitsGained);`];
        unitText = 'totalUnitsGained';
      }

      // dump it on the page. it's an "exploit"
      $window.increaseUnits = function() { GameState.unit.inc(GainCalculator.all()); };

      return `${timeout}
${functionHeader[0]}
  ${animationHeader[0]}
  ${iterationHeader[0]}
    ${unitText} += ${GainCalculator.boost()};
  ${iterationHeader[1]}
  ${animationHeader[1]}
${functionHeader[1]}
`;
    }
  };
};

functionBuilder.$inject = ['GameState', 'GainCalculator', '$window'];

module.exports = functionBuilder;