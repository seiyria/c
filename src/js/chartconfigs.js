
var chartConfigs = function($q, GameState) {
  var defer = $q.defer();

  var overTime = {

    values: function() {
      return _.pairs(GameState.sourcesGet.get());
    },

    chart: function() {
      return {
        options: {
          chart: {
            type: 'pie'
          },
          plotOptions: {
            pie: {
              dataLabels: {
                enabled: true
              },
              showInLegend: true
            }
          }
        },
        title: {
          text: ''
        },
        series: [{
          name: 'Source Breakdown',
          data: this.values()
        }]
      };
    }
  };

  GameState.unit.watch().then(null, null, function() {
    defer.notify({overTime: overTime.values()});
  });

  return {
    get: function() {
      return {overTime: overTime.chart()};
    },
    watch: function() {
      return defer.promise;
    }
  };
};

chartConfigs.$inject = ['$q', 'GameState'];

module.exports = chartConfigs;