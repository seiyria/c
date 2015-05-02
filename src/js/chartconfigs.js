
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

  var productionValues = () => _.pairs(GameState.sourcesGet.get());

  var production = {
    defaultObj: {
      options: {
        chart: {
          type: 'pie'
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          pie: {
            dataLabels: {
              enabled: false
            },
            showInLegend: false
          }
        }
      },
      title: {
        text: ''
      },
      series: [{
        name: 'Data',
        data: productionValues()
      }]
    },

    chart: function() {
      return this.defaultObj;
    }
  };

  var overTimeValues = () => GameState.historyGet.get();

  var overTime = {
    defaultObj: {
      options: {
        chart: {
          type: 'line'
        },
        legend: {
          enabled: false
        }
      },
      yAxis: {
        title: {
          text: ''
        }
      },
      xAxis: {
        type: 'datetime',
        tickPixelInterval: 150,
        title: {
          text: ''
        }
      },
      title: {
        text: ''
      },
      series: [{
        name: 'Data',
        data: overTimeValues()
      }]
    },
    chart: function() {
      return this.defaultObj;
    }
  };

  var checkDefaults = () => {
    if(GameState.upgrade.has('Production Labels')) {
      overTime.defaultObj.yAxis.title.text = 'Production';
      overTime.defaultObj.xAxis.title.text = 'Timestamp';
    }

    if(GameState.upgrade.has('Breakdown Labels')) {
      production.defaultObj.options.plotOptions.pie.dataLabels.enabled = true;
      production.defaultObj.options.plotOptions.pie.showInLegend = true;
    }
  };

  checkDefaults();

  GameState.upgrade.watch().then(null, null, checkDefaults);

  GameState.unit.watch().then(null, null, function() {
    defer.notify({overTime: overTimeValues(), production: productionValues()});
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
