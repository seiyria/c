var functionBuilder = function(GameState, GainCalculator, $window) {
  return {
    build: function() {

      var upgrade = GameState.upgrade;

      var unitText = `${_.camelCase(GameState.currencySet.get())}s`;
      var _unitName = unitText;

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
        var timeoutText = 'increaseUnits';

        if(GameState.upgrade.has('Basic Timer Boost')) {
          timeoutText =
`function massiveGains() {
  for(var i = 0; i < ${GainCalculator.timerBoost(upgrade)}; i++) {
    ${timeoutText}();
  }
}`;
        }

        timeout = `$interval(${timeoutText}, ${GainCalculator.timer(upgrade)});\n`;
      }

      var animationHeader = ['',''];
      if(GameState.upgrade.has('Basic Animation')) {
        animationHeader = [
  `var totalUnitsGained = 0;`,
  `${_unitName} += totalUnitsGained;
  animateUnitChange(totalUnitsGained);`];
        unitText = 'totalUnitsGained';
      }

      var saveHeader = ['', ''];
      if(GameState.upgrade.has('Save', 1)) {
        saveHeader = [
  `\nvar currentTick = 0;`, `
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
      $window.increaseUnits = function(mult = 1, source = 'Cheating') {
        GameState.unit.inc(mult * GainCalculator.all(upgrade), true, source);
        if(source === 'Cheating') {
          GameState.achieve('Pumpkin Eater');
        }
      };

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