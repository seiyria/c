var functionBuilder = function(GameState, GainCalculator, $window) {
  return {
    build: function() {

      var upgrade = GameState.upgrade;

      var unitText = `${GameState.currencySet.get()}s`;

      var functionHeader = ['',''];
      if(GameState.upgrade.has('Function')) {
        functionHeader = [`function increaseUnits() {`, `}`];
      }

      var iterationHeader = ['',''];
      if(GameState.upgrade.has('Basic Iteration')) {
        iterationHeader = [`for(var i = 0; i < ${GainCalculator.iteration(upgrade)}; i++) {`, `}`];
      }

      var timeout = ``;
      if(GameState.upgrade.has('Basic Timer')) {
        timeout = `$interval(increaseUnits, ${GainCalculator.timer(upgrade)});\n`;
      }

      var animationHeader = ['',''];
      if(GameState.upgrade.has('Basic Animation')) {
        animationHeader = [
          `var totalUnitsGained = 0;`,
          `units += totalUnitsGained;
  animateUnitChange(totalUnitsGained);`];
        unitText = 'totalUnitsGained';
      }

      var saveHeader = ['', ''];
      if(GameState.upgrade.has('Save', 1)) {
        saveHeader = [`\nvar currentTick = 0;`, `
  if(++currentTick % 10 === 0) {
    currentTick = 0;
    save();
  }`];
      }

      if(GameState.upgrade.has('Save', 3)) {
        saveHeader = ['', `
  save();`];
      }

      // dump it on the page. it's an "exploit"
      $window.increaseUnits = function() { GameState.unit.inc(GainCalculator.all(upgrade)); };

      return `${timeout}${saveHeader[0]}
${functionHeader[0]}
  ${animationHeader[0]}
  ${iterationHeader[0]}
    ${unitText} += ${GainCalculator.boost(upgrade)};
  ${iterationHeader[1]}
  ${saveHeader[1]}
  ${animationHeader[1]}
${functionHeader[1]}
`;
    }
  };
};

functionBuilder.$inject = ['GameState', 'GainCalculator', '$window'];

module.exports = functionBuilder;