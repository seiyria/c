
var upgradePath = function($q, GameState, UPGRADES) {
  var defer = $q.defer();

  var structure = {
    nodes: [],
    links: []
  };

  var recalculate = function() {
    structure.nodes = _(GameState.upgrade.get()).keys().filter(key => _.has(UPGRADES, key)).map(key => { return {name: key}; }).value();
    structure.links = _(structure.nodes).map(node => {
      var nodeLinks = [];

      _.each(UPGRADES[node.name].requirements, (val, key) => {
        nodeLinks.push({
          source: _.findWhere(structure.nodes, {name: key}),
          value: 1,
          target: _.findWhere(structure.nodes, {name: node.name})
        });
      });

      return nodeLinks;
    }).flatten().value();

    defer.notify(structure);
  };

  recalculate();

  GameState.upgrade.watch().then(null, null, recalculate);

  return {
    get: function() {
      return structure;
    },
    watch: function() {
      return defer.promise;
    }
  };
};

upgradePath.$inject = ['$q', 'GameState', 'Upgrades'];

module.exports = upgradePath;