
var chartConfigs = function($q, GameState) {
  var defer = $q.defer();

  Highcharts.setOptions({
    global: {
      useUTC: false
    },
    lang: {
      thousandsSep: ','
    }
  });

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
          data: this.values()
        }]
      };
    }
  };

  var production = {
    values: function() {
      return GameState.historyGet.get();
    },
    chart: function() {
      return {
        options: {
          chart: {
            type: 'line'
          },
          legend: {
            enabled: false
          },
          yAxis: {
            title: {
              text: 'Production'
            }
          },
          xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            title: {
              text: 'Timestamp'
            }
          }
        },
        title: {
          text: ''
        },
        series: [{
          data: this.values()
        }]
      };
    }
  };

  GameState.unit.watch().then(null, null, function() {
    defer.notify({overTime: overTime.values(), production: production.values()});
  });

  return {
    get: function() {
      return {overTime: overTime.chart(), production: production.chart()};
    },
    watch: function() {
      return defer.promise;
    }
  };
};

chartConfigs.$inject = ['$q', 'GameState'];

module.exports = chartConfigs;